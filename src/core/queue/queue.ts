import { Node } from "@babel/types";
import { Config } from "../../models/config";
import { IMessageQueue } from "./abstracts/IMessage-queue";
import { MessageQueue } from "./abstracts/message-queue";
import { QueueMessage } from "./models/queue-message";
import { AzureServiceBusQueue } from "./providers/azure-service-bus-queue";

export class Queue extends MessageQueue implements IMessageQueue {

    constructor(config: Config,queueName:string) {
        super();
        this.initializeProvider(config,queueName);
    }

    private autoTimer: NodeJS.Timer|null = null;

    listen(): Promise<void> {
        return this.client.listen();
    }

    send(): Promise<any> {
        return this.client.send();
    }

    add(message: QueueMessage): Promise<any> {
        return this.client.add(message);
    }

    protected initializeProvider(config: Config,queueName:string): void {
        this.client = new AzureServiceBusQueue(config,queueName,this);
    }

    // Enable auto send
    enableAutoSend(time:number){
        // Start a timer for 5 seconds and mark send.
      this.autoTimer =   setInterval(()=>{
            this.client.send();
        },time*1000);
    }
}