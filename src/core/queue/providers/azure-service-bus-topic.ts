import { ServiceBusClient, ServiceBusReceiver, ServiceBusSender, ServiceBusReceivedMessage } from "@azure/service-bus";
import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { IMessageTopic, ITopicSubscription } from "../abstracts/IMessage-topic";
import { QueueMessage } from "../models/queue-message";
import { AzureQueueConfig } from "./azure-queue-config";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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
    * If errors occur, the receiver is recreated if necessary, and polling continues.
    */
    subscribe(subscription: string, handler: ITopicSubscription): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Initialize the receiver.
                this.listener = this.sbClient.createReceiver(this.topic, subscription);

                const receiveMessages = () => {
                    console.log(`Receiving messages called. Listener active: ${!this.listener?.isClosed}`);
                    // Use the current listener to receive messages
                    this.listener!
                        .receiveMessages(this.maxConcurrentMessages, { maxWaitTimeInMs: 5000 })
                        .then((messages) => {
                            if (messages.length === 0) {
                                // No messages received; continue polling
                                return receiveMessages();
                            }
                            console.log(`Received ${messages.length} messages`);
                            const processingPromises = messages.map((message) =>
                                this.processMessageWithLockRenewal(message, handler)
                            );

                            Promise.allSettled(processingPromises).then(() => {
                                console.log(`Processed ${messages.length} messages`);
                                // Continue after processing the current batch
                                receiveMessages();
                            });
                        })
                        .catch(async (error: any) => {
                            console.error("Error in message processing:", error);

                            // Determine if the error requires recreating the receiver.
                            if (this.shouldRecreateReceiver(error)) {
                                console.log("Recreating receiver due to error:", error.message);
                                // Close the current receiver if it's not already closed
                                if (this.listener && !this.listener.isClosed) {
                                    this.listener.close().catch(console.error);
                                }
                                // Re-create the receiver to recover from connection errors.
                                this.listener = this.sbClient.createReceiver(this.topic, subscription);
                            } else {
                                console.error("Non-fatal error encountered, continuing polling:", error);
                            }
                            // Continue polling after a short delay.
                            await delay(1000);
                            receiveMessages();
                        });
                };

                receiveMessages();
                console.log('Resolving subscription');
                resolve();
            } catch (error) {
                console.error("Failed to subscribe:", error);
            }
        });
    }

    private shouldRecreateReceiver(error: any): boolean {
        if (!error) return false;
        if (error.code === "GeneralError" || error.name === "ServiceCommunicationError") return true;
        if (error.message?.includes("Unknown error occurred") || error.retryable === true) return true;

        console.warn("Unexpected error occurred, considering recreation:", error);
        return true; // Fallback to recreating the receiver
    }

    /**
    * Processes a single message with manual lock renewal using a recursive setTimeout.
    */
    private async processMessageWithLockRenewal(
        message: ServiceBusReceivedMessage,
        handler: ITopicSubscription
    ): Promise<void> {
        let isProcessingComplete = false;

        // Using setInterval for lock renewal.
        const renewLock = async () => {
            console.log(`Renewing lock for message ID: ${message.messageId}`);
            if (isProcessingComplete) {
                console.log(`Process completed. Stopping lock renewal for message ID: ${message.messageId}`);
                return;
            }

            try {
                await this.listener!.renewMessageLock(message);
                // Optionally, log successful renewal.
                // console.log("Message lock renewed");
            } catch (error: any) {
                // If the lock is lost, stop trying to renew it.
                if (error.code === "MessageLockLost") {
                    console.error("Message lock lost; stopping renewal.");
                    return;
                } else {
                    console.error("Error renewing message lock:", error);
                }
            }
            // Schedule the next renewal after lockRenewalTime.
            setTimeout(renewLock, this.lockRenewalTime);
        }
        // Start lock renewal.
        renewLock();

        try {
            // Process the message using the provided handler.
            await handler.onReceive(QueueMessage.from(message.body));
            await this.listener!.completeMessage(message);
        } catch (error) {
            console.error("Error processing message:", error);
            await this.listener!.abandonMessage(message);
            // @ts-ignore: Assume handler.onError can accept any error.
            await handler.onError(error);
        } finally {
            isProcessingComplete = true; // Stop further lock renewals.
        }
    }

    /**
    * Publishes a new message to the topic.
    */
    publish(message: QueueMessage): Promise<void> {
        return this.sender.sendMessages({ body: message });
    }
}
