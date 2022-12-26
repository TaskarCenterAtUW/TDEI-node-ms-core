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
    private parent: any;
    private config: LocalQueueConfig;

    constructor(queueName:string, parent: any, config: LocalQueueConfig = LocalQueueConfig.default()) {
        this.config = config;
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

    async send(): Promise<boolean> {

        if(this.currentMessages.length === 0){
            return Promise.resolve(true);
        }
        const messagesToSend: LocalQueueMessage[] = []
        var sent = true;
        try {
        this.currentMessages.forEach(async (singleMessage) => {
            messagesToSend.push({ body: singleMessage });
            const result = await this.channel?.sendToQueue(this.queueName, Buffer.from(JSON.stringify(singleMessage.toJSON())));
            if(result) {
                sent = sent && result;
            }
        });
        return Promise.resolve(sent);
    }
    catch(e){
        return Promise.reject(e);
    }finally{         
        // Clean the queue
        this.currentMessages = [];

    }

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
        if(eventMap == undefined){
            console.log('undefined event map');
            return;
        }
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

    }

    async setup(): Promise<this> {
        
        return new Promise((resolve,reject)=>{
            client.connect(this.config.connectionString).then((con)=>{
                this.connection = con;
                this.connection?.createChannel().then((chan)=>{
                    this.channel = chan;
                    this.channel?.assertQueue(this.queueName,{
                        durable:false,
                        autoDelete:false,
                    }).then((result)=>{
                        // this.parent = this;
                        resolve(this);
                    })
                    console.log('Channel created');
                    
                })
             }).catch((e)=>{
                reject(e);
             });

        })
    }

    async closeConnection() : Promise<void> {
         
        await this.channel?.close();
        await this.connection?.close();
        return Promise.resolve();
    }

    // convenience method for testing.
    setParent(parent:any){
        this.parent = parent;
    }

}