/**
 * Unit tests for `azure-service-bus-queue.ts`
 * Depends on @azure/service-bus
 */

import { MessageHandlers, ServiceBusMessage, ServiceBusReceivedMessage, SubscribeOptions } from "@azure/service-bus";
import { AzureServiceBusQueue } from "../src/core/queue/providers/azure-service-bus-queue";
import { AzureQueueConfig } from "../src/core/queue/providers/azure-queue-config";
import { Queue, QueueMessage } from "../src/core/queue";

const fakeSendMessage = jest.fn();
const fakeSubscribe = jest.fn();
const fakeReceive = jest.fn();

jest.mock('@azure/service-bus', () => {
    return {
        ServiceBusClient: jest.fn().mockImplementation(() => {
            return {
                createSender: jest.fn().mockImplementation(() => {
                    return {
                        sendMessages: (messages: ServiceBusMessage[]): Promise<void> => { fakeSendMessage(); return Promise.resolve() }
                    }
                }),
                createReceiver: jest.fn().mockImplementation(() => {
                    return {
                        subscribe: (handlers: MessageHandlers, options?: SubscribeOptions) => {
                            fakeSubscribe();
                        },
                        receiveMessages: (messageCount: number): Promise<{ body: any }[]> => {
                            fakeReceive();
                            const sbm = {
                                body: {
                                    messageType: 'sample-event',
                                    message: 'sample message'
                                },

                            }
                            return Promise.resolve([sbm]);

                        },
                        completeMessage: (): Promise<void> => {
                            return Promise.resolve();
                        }
                    }
                })
            }
        }),
    }
})
jest.mock('../src/core/queue')

describe('Azure service bus', () => {

    const queuemessage = QueueMessage.from({
        message: 'Sample message',
        messageId: '123',
        messageType: 'sample-event',
        publishedDate: ('{publishedDate}')
    });

    it('should intialize with proper queue', () => {
        // Arrange and Act
        let azureQueue = new AzureServiceBusQueue(AzureQueueConfig.default(), 'sample', new Queue(AzureQueueConfig.default(), 'sample'));
        // Assert
        expect(azureQueue).toBeTruthy();
    })
    it('Should be able to send messages', () => {
        // Arrange
        let azureQueue = new AzureServiceBusQueue(AzureQueueConfig.default(), 'sample', new Queue(AzureQueueConfig.default(), 'sample'));
        azureQueue.add(queuemessage);
        // Act
        azureQueue.send();
        // Assert
        expect(fakeSendMessage).toHaveBeenCalledTimes(1);

    })
    it('Should be able to receive messages', async () => {
        // Arrange
        let azureQueue = new AzureServiceBusQueue(AzureQueueConfig.default(), 'sample', new Queue(AzureQueueConfig.default(), 'sample'));
        // Act
        await azureQueue.listen(false);
        // Assert
        expect(fakeReceive).toHaveBeenCalledTimes(1);

    })
})