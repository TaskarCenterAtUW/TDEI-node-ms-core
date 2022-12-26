// integration test for local queue

import { QueueMessage, When } from "../../core/queue";
import { LocalQueue } from "../../core/queue/providers/local/local-queue";

class SampleParentClass {
    
}

class TestQueue extends LocalQueue {
    public static onTestMessageReceivedSpy = jest.fn();

    @When('sample')
    public onSampleMessage(msg: QueueMessage){
        console.log('yay!!');
        TestQueue.onTestMessageReceivedSpy(msg);
    }
}

describe('Local queue setup should work',()=> {
    const queueName = 'test-queue';
    const parent = new SampleParentClass();
    const localQueue = new LocalQueue(queueName,parent);
    
    it('should be able to setup properly', async ()=>{
        var closed = await localQueue.setup()
        expect(closed).toBeInstanceOf(LocalQueue);
    });

    afterAll(async () =>{
        await localQueue.closeConnection();
    });

})

describe('Local queue ',()=> {
    const queueName = 'test-queue';
    const parent = new SampleParentClass();
    const localQueue = new LocalQueue(queueName,parent);
    const queueMessage = QueueMessage.from({message:'Hello there',messageType:'sample'});
    const customQueue = new TestQueue(queueName,parent);

    beforeAll(async ()=>{
     await localQueue.setup();
     
    });
    afterAll(async () =>{
        await localQueue.closeConnection();
    });

    test('should be able to send message', async ()=>{

        localQueue.add(queueMessage);
        const result = localQueue.send();
        expect(result).resolves.toBeTruthy();
    });
})
const delay = ms => new Promise(res=>setTimeout(res,ms));

describe('Local custom queue',()=>{
    const queueName = 'test-queue';
    const parent = new SampleParentClass();
    const queueMessage = QueueMessage.from({message:'Hello there',messageType:'sample'});
    const customQueue = new TestQueue(queueName,parent);

    beforeAll(async ()=>{
        await customQueue.setup();
        customQueue.setParent(customQueue);
        
       });
       afterAll(async () =>{
           await customQueue.closeConnection();
       });
   
       test('should be able to send message', async ()=>{
   
            customQueue.add(queueMessage);
           const result = customQueue.send();
           expect(result).resolves.toBeTruthy();
       });
       test('should be able to receive message',async ()=>{
            await customQueue.listen();
            customQueue.add(queueMessage);
            const result = await customQueue.send();
            await delay(200); // Make a delay of
            expect(TestQueue.onTestMessageReceivedSpy).toBeCalled();
            
       });

})



