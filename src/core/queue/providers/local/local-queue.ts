import { IMessageQueue } from "../../abstracts/IMessage-queue";
import { QueueMessage } from "../../models/queue-message";

import client, { Channel, Connection } from "amqplib";
import { Queue } from "../../queue";
import { LocalQueueConfig } from "./local-queue-config";

type LocalQueueMessage = {
    body: QueueMessage
};

export class LocalQueue implements IMessageQueue {

    // var connection: Connection;
    private connection?: Connection;
    private channel?: Channel;
    private queueName: string;
    private currentMessages: QueueMessage[] = [];
    private parent: Queue;

    constructor(queueName:string, parent: Queue, config: LocalQueueConfig = LocalQueueConfig.default()) {

         client.connect(config.connectionString).then((con)=>{
            this.connection = con;
            this.connection?.createChannel().then((chan)=>{
                this.channel = chan;
                this.channel?.assertQueue(queueName,{
                    durable:false,
                    autoDelete:false,
                });
                console.log('Channel created');
            })
         });
         this.parent = parent;
         this.queueName = queueName;
    }

    listen(): Promise<void> {
        this.channel?.consume(this.queueName,(message)=>{
            console.log('received message');
            // console.log(message?.content.toString());
            this.on(message!);

        },{noAck:true});
        return Promise.resolve();
    }

    async send(): Promise<any> {

        if(this.currentMessages.length === 0){
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

    private async on(message: client.ConsumeMessage) {

        console.log('1');
        // Get the type and start figuring out.
        const body = JSON.parse(message.content.toString());
        console.log('2');
        console.log(body);

        // console.log(body['type']);
        const messageType = body['messageType'];
        console.log(messageType);
        // Check if there is any method listening to it.
        const eventMap = Reflect.getMetadata('eventHandlers', this.parent.constructor.prototype) as Map<
            string,
            // eslint-disable-next-line
            // @typescript-eslint/ban-types
            { handler: Function }[]
        >;
        const eventHandlers = eventMap.get(messageType);
        if (eventHandlers !== undefined) {
            // Generate Queuemessage
            const queueMessage = QueueMessage.from(body); // TODO: Parse based on the message type
            console.log('Received Message raw body', { body: body });
            // this.logger?.recordMessage(queueMessage,false);
            console.debug('Help me');
            for (const { handler } of eventHandlers) {

                handler.call(this, queueMessage);
            }
        }
        else {
            // console.log("Event handlers for "+messageType+" undefined");
        }
        // if (this.shouldComplete) {
        //     this.listener.completeMessage(message); // To be called later.
        // }

    }

}