import { IMessageTopic, ITopicSubscription } from "../../abstracts/IMessage-topic";
import { QueueMessage } from "../../models/queue-message";
import client, { Channel, Connection } from "amqplib";
import { LocalQueueConfig } from "./local-queue-config";
import { IQueueConfig } from "../../../../models/abstracts/iqueueconfig";

export class LocalTopic implements IMessageTopic {

    private connection?: Connection;
    private channel?: Channel;
    private exchangeName: string;
    constructor(topic:string, config: IQueueConfig = LocalQueueConfig.default()) {
        let localConfig = LocalQueueConfig.default();
        if (config instanceof LocalQueueConfig) {
            localConfig = config;
        }
        this.exchangeName = topic;
        client.connect(localConfig.connectionString).then((con)=>{
           this.connection = con;
           this.connection?.createChannel().then((chan)=>{
               this.channel = chan;
               console.log('Channel created');
               
               this.channel?.assertExchange(topic,'fanout',{durable:false});
            //    this.channel?.checkExchange(topic).then((result)=>{
            //     console.log('exchange exists')
            //    }).catch((e)=>{
            //     console.log('error with exchange');
            //    });
           })
        });
        // Check for the name of exchange
        // this.parent = parent;
        // this.queueName = queueName;
   }

    async subscribe(subscription: string, handler: ITopicSubscription): Promise<void> {
         // Check for exclusive queue for this
         await this.channel?.assertQueue(subscription,{exclusive:true});
         await this.channel?.bindQueue(subscription,this.exchangeName,'');
        this.channel?.consume(subscription,(message:client.ConsumeMessage|null)=>{
            if(message == null){
                return;
            }
            // Generate the message back
            const body = JSON.parse(message.content.toString());
            const queueMessage = QueueMessage.from(body); // TODO: Parse based on the message type
            handler.onReceive(queueMessage);

        });
         return Promise.resolve();
    }

    publish(message: QueueMessage): Promise<void> {
        this.channel?.publish(this.exchangeName,'',Buffer.from(JSON.stringify(message.toJSON())));
        return Promise.resolve();
    }
    
}