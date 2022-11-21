import { ServiceBusClient, ServiceBusReceiver, ServiceBusSender } from "@azure/service-bus";
import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { IMessageTopic, ITopicSubscription } from "../abstracts/IMessage-topic";
import { QueueMessage } from "../models/queue-message";
import { AzureQueueConfig } from "./azure-queue-config";

export class AzureServiceBusTopic implements IMessageTopic {

    // Consturctor needed for this
    private sbClient: ServiceBusClient;
    private listener?: ServiceBusReceiver;
    private sender: ServiceBusSender;
    private topic: string;


    constructor(config: IQueueConfig, topic: string) {
        let azureQueueConfig = AzureQueueConfig.default();
        if (config instanceof AzureQueueConfig) {
            azureQueueConfig = config;
        }

        this.sbClient = new ServiceBusClient(azureQueueConfig.connectionString);
        this.sender = this.sbClient.createSender(topic);
        this.topic = topic;
    }


    subscribe(subscription: string, handler: ITopicSubscription): Promise<void> {
        try {
            this.listener = this.sbClient.createReceiver(this.topic, subscription);
            this.listener?.subscribe({
                processMessage: (message): Promise<void> => {
                    const body = message.body;
                    const queueMessage = QueueMessage.from(body);
                    handler.onReceive(queueMessage);
                    return Promise.resolve();
                },
                processError: (error): Promise<void> => {
                    handler.onError(error.error);
                    return Promise.reject();
                }
            });
            return Promise.resolve();
        }
        catch (error) {
            return Promise.reject(error);
        }

    }
    publish(message: QueueMessage): Promise<void> {

        return this.sender.sendMessages({ body: message });
    }

}