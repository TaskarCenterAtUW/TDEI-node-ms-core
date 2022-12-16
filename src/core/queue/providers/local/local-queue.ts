import { IMessageQueue } from "../../abstracts/IMessage-queue";
import { QueueMessage } from "../../models/queue-message";

import client, { Channel, Connection } from "amqplib";

type LocalQueueMessage = {
    body: QueueMessage
};

export class LocalQueue implements IMessageQueue {

    // var connection: Connection;
    private connection?: Connection;
    private channel?: Channel;
    private queueName: string;
    private currentMessages: QueueMessage[] = [];

    constructor(queueName:string) {
         client.connect('amqp://localhost').then((con)=>{
            this.connection = con;
            this.connection?.createChannel().then((chan)=>{
                this.channel = chan;
                console.log('Channel created');
            })
         });
         this.queueName = queueName;
    }

    listen(): Promise<void> {
        this.channel?.consume(this.queueName,(message)=>{
            console.log('received message');
            console.log(message?.content.toString());

        });
        return Promise.resolve();
    }

    async send(): Promise<any> {

        if(this.currentMessages.length == 0){
            return;
        }
        const messagesToSend: LocalQueueMessage[] = []
        this.currentMessages.forEach(async (singleMessage) => {
            messagesToSend.push({ body: singleMessage });
            await this.channel?.sendToQueue(this.queueName, Buffer.from(JSON.stringify(singleMessage.toJSON())));
        });
         // Clean the queue
         this.currentMessages = [];
    }


   async add(message: QueueMessage): Promise<any> {
        this.currentMessages.push(message);
    }

}