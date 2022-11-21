import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { IMessageTopic } from "./IMessage-topic";

export abstract class MessageTopic {
    protected client?: IMessageTopic;
    protected abstract initializeProvider(config: IQueueConfig, topicName: string): void;
}