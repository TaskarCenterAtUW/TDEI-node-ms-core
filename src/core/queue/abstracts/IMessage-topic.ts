import { QueueMessage } from "../models/queue-message";

// Alias for QueueMessage is Topic Message
export type TopicMessage = QueueMessage;

export interface IMessageTopic {

    subscribe(subscription: string, handler: ITopicSubscription): Promise<void>;

    publish(message: TopicMessage): Promise<void>;

}

export interface ITopicSubscription {

    onReceive(message: TopicMessage);

    onError(error: Error);
}