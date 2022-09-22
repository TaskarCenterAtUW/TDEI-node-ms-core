import { IMessageQueue } from "./abstracts/IMessage-queue";
import { MessageQueue } from "./abstracts/message-queue";
import { QueueMessage } from "./models/queue-message";
import { AzureServiceBusQueue } from "./providers/azure-service-bus-queue";

export class Queue extends MessageQueue implements IMessageQueue {

    listen(): Promise<void> {
        return this.client.listen();
    }

    send(): Promise<any> {
        return this.client.send();
    }

    add(message: QueueMessage): Promise<any> {
        return this.client.add(message);
    }

    protected initializeProvider(): void {
        this.client = new AzureServiceBusQueue('', '');
    }
}