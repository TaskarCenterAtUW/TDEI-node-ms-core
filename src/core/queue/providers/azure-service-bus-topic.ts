import { ServiceBusClient, ServiceBusReceiver, ServiceBusSender, ServiceBusReceivedMessage } from "@azure/service-bus";
import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { IMessageTopic, ITopicSubscription } from "../abstracts/IMessage-topic";
import { QueueMessage } from "../models/queue-message";
import { AzureQueueConfig } from "./azure-queue-config";

export class AzureServiceBusTopic implements IMessageTopic {

    // Constructor needed for this
    private sbClient: ServiceBusClient;
    private listener?: ServiceBusReceiver;
    private sender: ServiceBusSender;
    private topic: string;
    private maxConcurrentMessages: number;

    constructor(config: IQueueConfig, topic: string, maxConcurrentMessages: number = 1) {
        let azureQueueConfig = AzureQueueConfig.default();
        if (config instanceof AzureQueueConfig) {
            azureQueueConfig = config;
        }

        this.sbClient = new ServiceBusClient(azureQueueConfig.connectionString);
        this.sender = this.sbClient.createSender(topic);
        this.topic = topic;
        this.maxConcurrentMessages = maxConcurrentMessages;
    }

    subscribe(subscription: string, handler: ITopicSubscription): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.listener = this.sbClient.createReceiver(this.topic, subscription);

                const receiveMessages = () => {
                    this.listener!
                        .receiveMessages(this.maxConcurrentMessages, { maxWaitTimeInMs: 5000, autoRenewLockDurationInMs: 60000 })
                        .then((messages) => {
                            if (messages.length === 0) {
                                return receiveMessages(); // Continue processing if no messages
                            }

                            const processingPromises = messages.map((message) =>
                                this.processMessage(message, handler)
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

    private processMessage(
        message: ServiceBusReceivedMessage,
        handler: ITopicSubscription
    ): Promise<void> {
        return handler.onReceive(QueueMessage.from(message.body))
            .then(() => {
                return this.listener!.completeMessage(message);
            })
            .catch((error) => {
                console.error("Error processing message:", error);
                this.listener!.abandonMessage(message);
                return handler.onError(error);
            });
    }

    publish(message: QueueMessage): Promise<void> {
        return this.sender.sendMessages({ body: message });
    }
}
