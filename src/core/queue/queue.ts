import { Node } from "@babel/types";
import { IQueueConfig } from "../../models/abstracts/iqueueconfig";
import { IMessageQueue } from "./abstracts/IMessage-queue";
import { MessageQueue } from "./abstracts/message-queue";
import { QueueMessage } from "./models/queue-message";
import { AzureQueueConfig } from "./providers/azure-queue-config";
import { AzureServiceBusQueue } from "./providers/azure-service-bus-queue";
import { LocalQueue } from "./providers/local/local-queue";

export class Queue extends MessageQueue implements IMessageQueue {

    constructor(config: IQueueConfig,queueName:string) {
        super();
        this.initializeProvider(config,queueName);
    }

    private autoTimer: NodeJS.Timer|null = null;

    listen(): Promise<void> {
        if(this.client){
            return this.client.listen();
        }
        else {
            return Promise.resolve();
        }
    }

    send(): Promise<any> {
        if(this.client){
            return this.client.send();
        }
        return Promise.resolve({});
    }

    add(message: QueueMessage): Promise<any> {
        if(this.client){
            return this.client.add(message);
        }
        else {
            console.log(message.toJSON());
            return Promise.resolve({});
        }
    }

    protected initializeProvider(config: IQueueConfig,queueName:string): void {
        if(config.provider == "Azure"){
            try {
            this.client = new AzureServiceBusQueue(config,queueName,this);
            } catch(e) {
                console.log('Faield to initialize queue');
                // console.log(e);
            }
        }
        if(config.provider == 'Local'){
            this.client = new LocalQueue(queueName);
        }
    }

    // Enable auto send
    enableAutoSend(time:number){
        this.startAutoSend(time);
    }

    async startAutoSend(time:number){
        await this.client?.send();
        setTimeout(()=>{
            this.startAutoSend(time);
        },time*1000);
    }
}