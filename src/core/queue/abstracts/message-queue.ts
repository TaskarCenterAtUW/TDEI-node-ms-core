import { Config } from "../../../models/config";
import { IMessageQueue } from "./IMessage-queue";

export abstract class MessageQueue 
{
    protected client!: IMessageQueue;
    protected abstract initializeProvider(config : Config,queuName:string) : void;
}