import { AzureQueueConfig } from "../src/core/queue/providers/azure-queue-config"
import {Core} from "../src/core";
import { AzureServiceBusTopic } from "../src/core/queue/providers/azure-service-bus-topic";
import { Topic } from "../src/core/queue/topic";
import { ITopicSubscription } from "../src/core/queue/abstracts/IMessage-topic";
import { QueueMessage } from "../src/core/queue";
import { BadRequestResourceError } from "../src/utils/resource-errors/bad-request-resource-error";

const fakePublish = jest.fn();
const fakeSubscribe = jest.fn();

jest.mock('../src/core/queue/providers/azure-service-bus-topic', () => {
    return {
        AzureServiceBusTopic: jest.fn().mockImplementation(() => {
            
        return {
            subscribe: (subscription: string, handler: ITopicSubscription): Promise<void> => { fakeSubscribe(); return Promise.resolve() },
            publish : (message: QueueMessage): Promise<void> => { fakePublish(); return Promise.resolve();}
        };
      })
    };
  });

describe('Azure service bus topic', ()=>{
    const configuration = AzureQueueConfig.default();
    const publishedDate = new Date(2022,5,18);
    const queuemessage = QueueMessage.from({
        message:'Sample message',
        messageId:'123',
        messageType:'sample-event',
        publishedDate: ('{publishedDate}')
    });

    it('Should have provider as azure', () => {
        expect(configuration.provider).toEqual("Azure");
    })

    it('Should get the service topic', () => {
        const topic = Core.getTopic('sampletopic',configuration);
        
        expect(topic).toBeInstanceOf(Topic);
        expect(AzureServiceBusTopic).toHaveBeenCalledTimes(1);
    })

    it('Should send message via ServiceBus when message is sent', () => {

        const topic = Core.getTopic('sampletopic',configuration);
       
        topic.publish(queuemessage);
        expect(fakePublish).toHaveBeenCalledTimes(1);

    })

    it('Should listen to the said subscription appropriately', () => {
        const topic = Core.getTopic('sampletopic',configuration);

        topic.subscribe('sample-subscription', {
            onReceive(message:QueueMessage){},
            onError(error:Error){}
        });
        expect(fakeSubscribe).toHaveBeenCalledTimes(1);
    })

    it('Should throw error when the client is not available', async () =>{

        const topic = Core.getTopic('sampletopic',configuration);
        // force assigning null for client
        topic.client = undefined;
       const result = topic.subscribe('sample-subscription', {
            onReceive(message:QueueMessage){},
            onError(error:Error){}
        })
        const publishResult = topic.publish(queuemessage);
        await expect(result).rejects.toThrow(BadRequestResourceError);
        await expect(publishResult).rejects.toThrow(BadRequestResourceError);

    })

})