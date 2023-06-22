import { Connection, Options } from "amqplib";
import { LocalQueueConfig } from "../src/core/queue/providers/local/local-queue-config";
import { LocalTopic } from "../src/core/queue/providers/local/local-topic";
import { MockConnection } from "./rabbitmq.mock";

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
jest.mock('amqplib', ()=>{
            return {
                connect:  (url: string | Options.Connect, socketOptions?: any): Promise<Connection> =>{
                    return Promise.resolve(new MockConnection())
                }
            }
    
})



describe('Local topic unit test', ()=>{

    it('Should initialize with any config', ()=>{
        const localConfig = LocalQueueConfig.default();
        const localTopic = new LocalTopic('sample',localConfig);
        expect(localTopic).toBeTruthy();
    })
    it('Should publish message to channel with publish', ()=>{

    })
    it('Should consume from the channel with consume', ()=>{

    })


})