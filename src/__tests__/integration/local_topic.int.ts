/**
 * Integration tests for LocalTopic class
 */

import { QueueMessage } from "../../core/queue";
import { LocalTopic } from "../../core/queue/providers/local/local-topic";

const delay = ms => new Promise(res=>setTimeout(res,ms));

describe('Local topic',()=>{

    const topicName = 'test-topic';
    const localTopic = new LocalTopic(topicName);
    const queueMessage = QueueMessage.from({message:'Hello there',messageType:'sample'});
    
    const receiveSpyFunction = jest.fn();

    test('should be able to publish message',async ()=>{
        await delay(1000);
        expect(localTopic.publish(queueMessage)).resolves;
        
    })

    test('should be able to receive message',async ()=>{

     await   localTopic.subscribe('test-subscription',{
            onReceive(message) {
                receiveSpyFunction();
            },
            onError(error) {
                
            },
        });
        await localTopic.publish(queueMessage);
        await delay(200);
        expect(receiveSpyFunction).toBeCalled();

    });
});