// import { describe, it } from "node:test";
// import { QueueMessage } from "../core/queue";
// Create a queuemessage and print its value

import { QueueMessage } from "../../lib/core/queue";


// console.log('Published date is ');
// let publishedDate = new Date(2022,5,18);
// console.log(queuemessage.publishedDate);
// console.log(publishedDate);
// console.log(queuemessage.publishedDate.getTime() ==  publishedDate.getTime());
/**
 * @group unit
 */

describe('QueueMessage', () => {

    it('Should create Queue appropriately',()=>{

        let publishedDate = new Date(2022,5,18);
        let queuemessage = QueueMessage.from({
            message:'Sample message',
            messageId:'123',
            messageType:'sample-event',
            publishedDate: publishedDate
        });
        expect(queuemessage.message).toBe("Sample message");
        expect(queuemessage.messageId).toBe("123");
        expect(queuemessage.messageType).toBe("sample-event");
        // expect(queuemessage.publishedDate).toBe(publishedDate);
    });
    it('Should Instantiate', () => {
        let queueMessage = QueueMessage.from();
        expect(queueMessage).toBeInstanceOf(QueueMessage);
    })

})
