import { Connection, Options } from "amqplib";
import { LocalQueueConfig } from "../src/core/queue/providers/local/local-queue-config";
import { LocalTopic } from "../src/core/queue/providers/local/local-topic";
import { MockChannel, MockConnection } from "./rabbitmq.mock";
import { QueueMessage } from "../src/core/queue";

/**
 * Unit testing for local-topic.ts file
 * Local topic depends on Connection, channel from amqplib
 * Connection -> Create Channel
 * Channel -> 
 *  - assertExchange
 *  - assertQueue
 *  - bindQueue
 *  - consume
 *  - publish
 * 
 */
const delay = ms => new Promise(res => setTimeout(res, ms));

const connection = new MockConnection();
const channel = new MockChannel();
const fakeConnect = jest.fn();


const fakeCreateChannel = jest.fn();
const fakePublish = jest.fn();
const fakeSubscribe = jest.fn();

jest.spyOn(connection, 'createChannel').mockImplementation(() => {
    fakeCreateChannel();
    return Promise.resolve(channel)
})

jest.spyOn(channel, 'publish').mockImplementation(() => {
    fakePublish();
    return true;
})
jest.spyOn(channel, 'consume').mockImplementation(() => {
    fakeSubscribe();
    return Promise.resolve({ consumerTag: '' });
})

jest.mock('amqplib', () => {
    return {
        connect: (url: string | Options.Connect, socketOptions?: any): Promise<any> => {
            fakeConnect();
            return Promise.resolve(connection)
        }
    }

})


describe('Local topic unit test', () => {
    const queuemessage = QueueMessage.from({
        message: 'Sample message',
        messageId: '123',
        messageType: 'sample-event',
        publishedDate: ('{publishedDate}')
    });
    const topicName = 'sample';

    it('Should initialize with any config', () => {
        // Arrange
        const localConfig = LocalQueueConfig.default();
        // Act
        const localTopic = new LocalTopic(topicName, localConfig);
        // Assert
        expect(localTopic).toBeTruthy();
        expect(fakeConnect).toHaveBeenCalledTimes(1);
    })
    it('Should initialize without any config', () => {
        // Act
        const localTopic = new LocalTopic(topicName);
        // Assert
        expect(localTopic).toBeTruthy();
        expect(fakeConnect).toHaveBeenCalledTimes(2);

    })
    it('Should publish message to channel with publish', async () => {
        // Arrange
        const localConfig = LocalQueueConfig.default();
        const localTopic = new LocalTopic(topicName, localConfig);
        await delay(300)
        // Act
        await localTopic.publish(queuemessage);
        // Assert
        expect(fakePublish).toHaveBeenCalledTimes(1);

    })
    it('Should consume from the channel with consume', async () => {
        // Arrange
        const localTopic = new LocalTopic(topicName, LocalQueueConfig.default());
        await delay(300);
        // Act
        await localTopic.subscribe('sample', {
            onError(error) {

            },
            onReceive(message) {

            },
        })
        // Assert
        expect(fakeSubscribe).toHaveBeenCalledTimes(1);

    })


})