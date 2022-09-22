import { IMessageQueue } from "../abstracts/IMessage-queue";
import { QueueMessage } from "../models/queue-message";
import { ServiceBusClient, ServiceBusReceivedMessage, ServiceBusReceiver, ServiceBusSender, ServiceBusMessage } from "@azure/service-bus";
import { Config } from "../../../models/config";

export class AzureServiceBusQueue implements IMessageQueue {
    private sbClient: ServiceBusClient;
    private listener: ServiceBusReceiver;
    private sender: ServiceBusSender;
    private currentMessages: QueueMessage[] = [];
    private shouldComplete : boolean = true;

    /**
     * Constructor for the queue listener
     * @param connectionString Connection string for the Azure Service Bus
     * @param queueName Name of the queue
     * @param shouldComplete Whether the message should be completed after receiving (defaults to true)
     */
    constructor(config: Config , queueName:string) {
        this.sbClient = new ServiceBusClient(config.cloudConfig.connectionString.serviceBus);
        this.listener = this.sbClient.createReceiver(queueName);
        this.sender = this.sbClient.createSender(queueName);
        
    }

    /**
    * start listening to the queue
    */
     async listen(): Promise<void> {
        return this.listenQueue();
    }

    async send(): Promise<any> {
        const messagesToSend: ServiceBusMessage[] = []
        this.currentMessages.forEach((singleMessage) => {
            messagesToSend.push({ body: singleMessage });
        });
        await this.sender.sendMessages(messagesToSend);
        // Send a log to insights.
        this.currentMessages.forEach((singleMessage) => {
            // this.logger?.recordMessage(singleMessage,true);
        });
    }


    async add(message: QueueMessage): Promise<any> {
        this.currentMessages.push(message);
    }

    private async listenQueue() {
        this.listener.receiveMessages(1).then((messages) => {
            messages.forEach(async (singleMessage) => {
                await this.on(singleMessage);
            });
            // Listen to it again.
            this.listen();
        });
    }

    private async on(message: ServiceBusReceivedMessage) {

        // Get the type and start figuring out.
        const body = message.body;
        // console.log(body['type']);
        const messageType = body['messageType'];
        // Check if there is any method listening to it.
        const eventMap = Reflect.getMetadata('eventHandlers', this.constructor.prototype) as Map<
            string,
            // eslint-disable-next-line @typescript-eslint/ban-types
            { handler: Function }[]
        >;
        const eventHandlers = eventMap.get(messageType);
        if (eventHandlers != undefined) {
            // Generate Queuemessage
            const queueMessage = QueueMessage.from(body); //TODO: Parse based on the message type
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
        if (this.shouldComplete) {
            this.listener.completeMessage(message); // To be called later.
        }

    }

}