import { IQueueConfig } from "../../models/abstracts/iqueueconfig";
import { BadRequestResourceError } from "../../utils/resource-errors/bad-request-resource-error";
import { IMessageTopic, ITopicSubscription } from "./abstracts/IMessage-topic";
import { MessageTopic } from "./abstracts/message-topic";
import { QueueMessage } from "./models/queue-message";
import { AzureServiceBusTopic } from "./providers/azure-service-bus-topic";
import { LocalTopic } from "./providers/local/local-topic";

export class Topic extends MessageTopic implements IMessageTopic {


    constructor(config: IQueueConfig, topicName: string) {
        super();
        this.initializeProvider(config, topicName);
    }

    subscribe(subscription: string, handler: ITopicSubscription): Promise<void> {
        if (this.client) {
            return this.client.subscribe(subscription, handler);
        } else {
            return Promise.reject(new BadRequestResourceError());
        }
    }


    publish(message: QueueMessage): Promise<void> {
        if (this.client) {
            return this.client.publish(message);
        } else {
            return Promise.reject(new BadRequestResourceError());
        }
    }

    protected initializeProvider(config: IQueueConfig, topicName: string): void {

        if (config.provider === "Azure") {
            try {
                this.client = new AzureServiceBusTopic(config, topicName);

            } catch (e) {
                console.log('Faield to initialize topic');
                // console.log(e);
            }
        } if(config.provider === "Local") {
            try{
                this.client = new LocalTopic(topicName,config);
            } catch(e){
                console.log('Failed to initialize topic')
            }

        }
    }

}