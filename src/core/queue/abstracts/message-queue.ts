import { IMessageQueue } from "./IMessage-queue";

export abstract class MessageQueue 
{
    protected client!: IMessageQueue;
    protected abstract initializeProvider() : void;
}