import { MessageQueue } from "./abstracts/message-queue";
import { AzureServiceBusQueue } from "./providers/azure-service-bus-queue";

export class tdeiQueue extends MessageQueue
{

    initializeProvider(): void {
        this.client = new AzureServiceBusQueue('', '');
    }
    
}