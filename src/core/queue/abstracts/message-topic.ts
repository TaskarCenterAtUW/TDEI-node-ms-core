import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { IMessageTopic } from "./IMessage-topic";

export abstract class MessageTopic {
    public client?: IMessageTopic; // For testability
    protected abstract initializeProvider(config: IQueueConfig, topicName: string, maxConcurrentMessages: number): void;
}