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
import { MessageHandlers, SubscribeOptions, ServiceBusReceiver } from "@azure/service-bus";

const fakeSendMessage = jest.fn();
const fakeSubscribe = jest.fn();

jest.mock('@azure/service-bus', () => {
    return {
        ServiceBusClient: jest.fn().mockImplementation(() => {
            return {
                createSender: jest.fn().mockImplementation(() => {
                    return {
                        sendMessages: (message: any): Promise<void> => { fakeSendMessage(message); return Promise.resolve() }
                    }
                }),
                createReceiver: jest.fn().mockImplementation(() => {
                    return {
                        subscribe: (handlers: MessageHandlers, options?: SubscribeOptions) => {
                            fakeSubscribe();
                        }
                    }
                })
            }
        }),
    }
})

describe('Azure service bus topic unit', () => {

    const queuemessage = QueueMessage.from({
        message: 'Sample message',
        messageId: '123',
        messageType: 'sample-event',
        publishedDate: ('{publishedDate}')
    });

    it('Should initialize with Azure default config if not provided', () => {
        // Arrange
        const configuration = LocalQueueConfig.default();
        // Act
        const azureTopic = new AzureServiceBusTopic(configuration, 'sample');
        // Assert
        expect(azureTopic).toBeTruthy();

    })

    it('Should have called and created topic and sender on init', () => {
        // Arrange
        const azureConfiguration = AzureQueueConfig.default();
        // Act
        const azureTopic = new AzureServiceBusTopic(azureConfiguration, 'sample');
        // Assert
        expect(azureTopic).toBeTruthy();
    })

    it('Should listen to a subscription using subscribe method', async () => {
        // Arrange
        const azureConfiguration = AzureQueueConfig.default();
        const azureTopic = new AzureServiceBusTopic(azureConfiguration, 'sample', 2);
    
        // Mocking onReceive and onError handlers
        const onReceiveMock = jest.fn((message) => {
            console.log('Mock onReceive called with message:', message);
        });
    
        const onErrorMock = jest.fn((error) => {
            console.error('Mock onError called with error:', error);
        });
    
        // Create a custom mock for receiveMessages:
        // - First call: resolves with an empty array (no messages)
        // - Subsequent calls: returns a pending promise (to stop recursion)
        const receiveMessagesMock = jest.fn()
            .mockImplementationOnce(() => Promise.resolve([]))
            .mockImplementation(() => new Promise(() => {}));
    
        // Spy on the sbClient.createReceiver to ensure it is called and return our custom receiver mock.
        const createReceiverSpy = jest.spyOn(azureTopic['sbClient'], 'createReceiver').mockReturnValue({
            receiveMessages: receiveMessagesMock,
            close: jest.fn(),
            isClosed: false,
        } as unknown as ServiceBusReceiver);
    
        // Act
        await azureTopic.subscribe('sample', {
            onReceive: onReceiveMock,
            onError: onErrorMock,
        });
    
        // Assert
        expect(createReceiverSpy).toHaveBeenCalledTimes(1);
        expect(createReceiverSpy).toHaveBeenCalledWith('sample', 'sample'); // Verify arguments
        expect(onReceiveMock).not.toHaveBeenCalled(); // No messages, so onReceive should not be called
        expect(onErrorMock).not.toHaveBeenCalled(); // No errors, so onError should not be called
    
        // Cleanup
        createReceiverSpy.mockRestore();
    });


    it('Should be able to call publish on sender when message is sent', async () => {
        // Arrange
        const azureConfiguration = AzureQueueConfig.default();
        const azureTopic = new AzureServiceBusTopic(azureConfiguration, 'sample');
        const applicationProperties = {
            key: "value",
            retryCount: 1,
            enabled: true,
            publishedDate: new Date("2026-02-11T00:00:00.000Z")
        };
        // Act
        await azureTopic.publish(queuemessage, applicationProperties);
        // Assert
        expect(fakeSendMessage).toBeCalledTimes(1);
        expect(fakeSendMessage).toHaveBeenCalledWith({
            body: queuemessage,
            applicationProperties
        });

    })

})
