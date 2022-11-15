import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { IMessageQueue } from "./IMessage-queue";

export abstract class MessageQueue 
{
    protected client?: IMessageQueue;
    protected abstract initializeProvider(config : IQueueConfig,queuName:string) : void;
}