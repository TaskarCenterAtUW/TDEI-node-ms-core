import { ServiceBusClient, ServiceBusReceiver, ServiceBusSender, ServiceBusReceivedMessage } from "@azure/service-bus";
import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { IMessageTopic, ITopicSubscription } from "../abstracts/IMessage-topic";
import { QueueMessage } from "../models/queue-message";
import { AzureQueueConfig } from "./azure-queue-config";

export class AzureServiceBusTopic implements IMessageTopic {
    private sbClient: ServiceBusClient;
    private listener?: ServiceBusReceiver;
    private sender: ServiceBusSender;
    private topic: string;
    private maxConcurrentMessages: number;
    private lockRenewalTime: number;

    constructor(config: IQueueConfig, topic: string, maxConcurrentMessages: number = 1) {
        let azureQueueConfig = AzureQueueConfig.default();
        if (config instanceof AzureQueueConfig) {
            azureQueueConfig = config;
        }

        this.sbClient = new ServiceBusClient(azureQueueConfig.connectionString);
        this.sender = this.sbClient.createSender(topic);
        this.topic = topic;
        this.maxConcurrentMessages = maxConcurrentMessages;
        this.lockRenewalTime = 25 * 1000; // 25 seconds
    }

    /**
    * Subscribes to the given subscription using a polling loop.
    * Instead of breaking on AMQP or connection errors,
    * this implementation reinitializes the receiver and continues polling.
    */
    subscribe(subscription: string, handler: ITopicSubscription): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Initialize the receiver
                this.listener = this.sbClient.createReceiver(this.topic, subscription);

                const receiveMessages = () => {
                    // Use the current listener to receive messages
                    this.listener!
                        .receiveMessages(this.maxConcurrentMessages, { maxWaitTimeInMs: 5000 })
                        .then((messages) => {
                            if (messages.length === 0) {
                                // No messages received; continue polling
                                return receiveMessages();
                            }

                            const processingPromises = messages.map((message) =>
                                this.processMessageWithLockRenewal(message, handler)
                            );

                            Promise.allSettled(processingPromises).then(() => {
                                // Continue after processing the current batch
                                receiveMessages();
                            });
                        })
                        .catch((error: any) => {
                            console.error("Error in message processing:", error);

                            // Check if the error indicates that we need to recreate the receiver.
                            if (this.shouldRecreateReceiver(error)) {
                                console.log("Recreating receiver due to error:", error.message);
                                // Instead of rejecting (which would break the subscription),
                                // we try to close the current receiver (if it's not already closed),
                                // reinitialize it, and continue polling.
                                if (this.listener && !this.listener.isClosed) {
                                    this.listener
                                    .close()
                                    .catch((closeErr) =>
                                        console.error("Error closing listener:", closeErr)
                                    );
                                }
                            // Re-create the receiver to recover from connection errors.
                            this.listener = this.sbClient.createReceiver(this.topic, subscription);

                            }
                            // Optionally add a delay before retrying the polling loop.
                            setTimeout(receiveMessages, 1000);
                        });
                };

                receiveMessages();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    private shouldRecreateReceiver(error: any): boolean {
        if (!error) return false;
        if (error.code === "GeneralError") return true; // Usually covers ECONNRESET error.
        if (error.name === "ServiceCommunicationError") return true;
        if (error.message?.includes("Unknown error occurred")) return true;

        // Fallback for an unknown fatal error:
        // e.g. look for "onDetached" or "MessagingError" in the stack or message
        if (error.retryable === true) return true;

        // Adjust logic as you see fit
        return true
        
    }

    /**
    * Processes a single message with manual lock renewal.
    */
    private async processMessageWithLockRenewal(
        message: ServiceBusReceivedMessage,
        handler: ITopicSubscription
    ): Promise<void> {
        let isProcessingComplete = false;

        // Using setInterval for lock renewal.
        const renewalInterval = setInterval(async () => {
            if (isProcessingComplete) {
                clearInterval(renewalInterval);
                return;
            }
            try {
                await this.listener!.renewMessageLock(message);
            } catch (error: any) {
                // If the lock is lost, stop trying to renew it.
                if (error.code === "MessageLockLost") {
                    console.error("Message lock lost; stopping renewal.");
                    clearInterval(renewalInterval);
                } else {
                    console.error("Error renewing message lock:", error);
                }
            }
        }, this.lockRenewalTime); // Renew lock every 30 seconds

        try {
            // Process the message with the provided handler.
            await handler.onReceive(QueueMessage.from(message.body));
            await this.listener!.completeMessage(message);
        } catch (error) {
            console.error("Error processing message:", error);
            await this.listener!.abandonMessage(message);
            // @ts-ignore
            await handler.onError(error);
        } finally {
            isProcessingComplete = true; // Stop lock renewal
            clearInterval(renewalInterval); // Ensure interval is cleared
        }
    }

    /**
    * Publishes a new message to the topic.
    */
    publish(message: QueueMessage): Promise<void> {
        return this.sender.sendMessages({ body: message });
    }
}
