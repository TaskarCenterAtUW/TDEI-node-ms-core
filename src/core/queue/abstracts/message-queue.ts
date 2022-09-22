import { IMessageQueue } from "./IMessage-queue";

export abstract class MessageQueue 
{
    public client!: IMessageQueue;
    abstract initializeProvider() : void;
}