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
        this.lockRenewalTime = 30 * 1000; // 30 seconds
    }

    subscribe(subscription: string, handler: ITopicSubscription): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.listener = this.sbClient.createReceiver(this.topic, subscription);

                const receiveMessages = () => {
                    this.listener!
                        .receiveMessages(this.maxConcurrentMessages, { maxWaitTimeInMs: 5000 })
                        .then((messages) => {
                            if (messages.length === 0) {
                                return receiveMessages(); // Continue processing if no messages
                            }

                            const processingPromises = messages.map((message) =>
                                this.processMessageWithLockRenewal(message, handler)
                            );

                            Promise.allSettled(processingPromises).then(() => {
                                receiveMessages(); // Continue after processing the current batch
                            });
                        })
                        .catch((error) => {
                            console.error("Error in message processing:", error);
                            reject(error);
                        });
                };

                receiveMessages();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    private async processMessageWithLockRenewal(
        message: ServiceBusReceivedMessage,
        handler: ITopicSubscription
    ): Promise<void> {
        let isProcessingComplete = false;

        // Start lock renewal
        const renewalInterval = setInterval(async () => {
            if (isProcessingComplete) {
                clearInterval(renewalInterval);
                return;
            }
            try {
                await this.listener!.renewMessageLock(message);
                console.log("Message lock renewed");
            } catch (error) {
                // @ts-ignore
                if (error.code === "MessageLockLost") {
                    console.error("Message lock lost; stopping renewal.");
                    clearInterval(renewalInterval);
                } else {
                    console.error("Error renewing message lock:", error);
                }
            }
        }, this.lockRenewalTime); // Renew lock every 30 seconds

        try {
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

    publish(message: QueueMessage): Promise<void> {
        return this.sender.sendMessages({ body: message });
    }
}
