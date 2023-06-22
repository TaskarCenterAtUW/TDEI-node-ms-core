/**
 * Unit tests for azure-service-bus-topic.ts file.
 * The class has 3 dependent classes to work with
 * `ServiceBusClient`, `ServiceBusReceiver`, and `ServiceBusSender`
 * All the three classes above have to be mocked to do unit tests.
 */

import { QueueMessage } from "../src/core/queue";
import { AzureQueueConfig } from "../src/core/queue/providers/azure-queue-config";
import { AzureServiceBusTopic } from "../src/core/queue/providers/azure-service-bus-topic";
import { LocalQueueConfig } from "../src/core/queue/providers/local/local-queue-config";
import { MessageHandlers, ServiceBusMessage, SubscribeOptions,ServiceBusSender } from "@azure/service-bus";

const fakeSendMessage = jest.fn();
const fakeSubscribe = jest.fn();

jest.mock('@azure/service-bus', ()=>{
    return {
        ServiceBusClient: jest.fn().mockImplementation(()=>{
            return {
            createSender: jest.fn().mockImplementation(()=>{
                return {
                    sendMessages: (messages: ServiceBusMessage[]):Promise<void> => {  fakeSendMessage(); return Promise.resolve()}
                }
            }),
            createReceiver: jest.fn().mockImplementation(()=>{
                return {
                subscribe:(handlers: MessageHandlers, options?: SubscribeOptions) =>{
                    fakeSubscribe();
                }
                }
            })
            }
        }),
    }
})

describe('Azure service bus topic unit',()=>{

    const queuemessage = QueueMessage.from({
        message:'Sample message',
        messageId:'123',
        messageType:'sample-event',
        publishedDate: ('{publishedDate}')
    });

    it('Should initialize with Azure default config if not provided', ()=>{
        const configuration = LocalQueueConfig.default();
        const azureTopic = new AzureServiceBusTopic(configuration,'sample');
        expect(azureTopic).toBeTruthy();

    })

    it('Should have called and created topic and sender on init', ()=>{
        const azureConfiguration = AzureQueueConfig.default();
        const azureTopic = new AzureServiceBusTopic(azureConfiguration,'sample');
        expect(azureTopic).toBeTruthy();
    })

    it('Should listen to a subscription using subscribe method', async () =>{
        const azureConfiguration = AzureQueueConfig.default();
        const azureTopic = new AzureServiceBusTopic(azureConfiguration,'sample');
        await azureTopic.subscribe('sample',{
            onReceive(message) {
                
            },
            onError(error) {
                
            },
        });
        expect(fakeSubscribe).toBeCalledTimes(1);

    })
    it('Should be able to call publish on sender when message is sent', async ()=>{
        const azureConfiguration = AzureQueueConfig.default();
        const azureTopic = new AzureServiceBusTopic(azureConfiguration,'sample');

        await azureTopic.publish(queuemessage)
        expect(fakeSendMessage).toBeCalledTimes(1);

    })

})