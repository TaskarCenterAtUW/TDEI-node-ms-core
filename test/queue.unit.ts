import { Core } from "../src/core";
import { Queue, QueueMessage } from "../src/core/queue";
import { AzureServiceBusQueue } from "../src/core/queue/providers/azure-service-bus-queue";

/**
 * Unit testing for queue.ts
 */

const fakeAdd = jest.fn();
const fakeSend = jest.fn();
const fakeListen = jest.fn();

jest.mock('../src/core/queue/providers/azure-service-bus-queue', () => {
    return {
        AzureServiceBusQueue: jest.fn().mockImplementation(() => {
            return {
                add: (message: QueueMessage): Promise<any> => { fakeAdd(); return Promise.resolve({}); },
                send: (): Promise<any> => { fakeSend(); return Promise.resolve({}) },
                listen: (): Promise<void> => { fakeListen(); return Promise.resolve() }
            }
        })
    }
})

describe('Queue ', () => {

    const queuemessage = QueueMessage.from({
        message: 'Sample message',
        messageId: '123',
        messageType: 'sample-event',
        publishedDate: ('{publishedDate}')
    });

    beforeAll(() => {
        Core.initialize();
    })

    it('Should get the Azure Queue', () => {
        // Arrange and Act
        const queue = Core.getQueue('samplequeue');
        // Assert
        expect(queue).toBeInstanceOf(Queue);
        expect(AzureServiceBusQueue).toHaveBeenCalledTimes(1);
    })

    it('Should be able to add messages', async () => {
        // Arrange
        const queue = Core.getQueue('sampletopic');
        // Act
        await queue.add(queuemessage)
        // Assert
        expect(fakeAdd).toHaveBeenCalledTimes(1);
    })
    it('Should be able to send messages', async () => {
        // Arrange
        const queue = Core.getQueue('sampletopic');
        await queue.add(queuemessage)
        // Act
        await queue.send()
        // Assert
        expect(fakeSend).toHaveBeenCalledTimes(1);

    })
    it('Should call listen messages', async () => {
        // Arrange
        const queue = Core.getQueue('sampletopic');
        // Act
        await queue.listen();
        // Assert
        expect(fakeListen).toHaveBeenCalledTimes(1);
    })

})