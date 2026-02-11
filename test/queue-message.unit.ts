// import { describe, it } from "node:test";
// import { QueueMessage } from "../core/queue";
// Create a queuemessage and print its value

import { QueueMessage } from "../src/core/queue";


// console.log('Published date is ');
// let publishedDate = new Date(2022,5,18);
// console.log(queuemessage.publishedDate);
// console.log(publishedDate);
// console.log(queuemessage.publishedDate.getTime() ==  publishedDate.getTime());
/**
 * @group unit
 */

describe('QueueMessage', () => {

    it('Should create Queue appropriately', () => {
        // Arrange
        const publishedDate = new Date(2022, 5, 18);
        const queuemessage = QueueMessage.from({
            message: 'Sample message',
            messageId: '123',
            messageType: 'sample-event',
            publishedDate: ('{publishedDate}'),
            file_size_mb: 1.5
        });
        // Assert
        expect(queuemessage.message).toBe("Sample message");
        expect(queuemessage.messageId).toBe("123");
        expect(queuemessage.messageType).toBe("sample-event");
        expect(queuemessage.fileSizeMb).toBe(1.5);
        // expect(queuemessage.publishedDate).toBe(publishedDate);
    });
    it('Should Instantiate', () => {
        // Arrange
        const queueMessage = QueueMessage.from();
        // Assert
        expect(queueMessage).toBeInstanceOf(QueueMessage);
    });

    it('Should convert file_size_mb string to number', () => {
        // Arrange
        const queueMessage = QueueMessage.from({
            file_size_mb: '20'
        });
        // Assert
        expect(queueMessage.fileSizeMb).toBe(20);
        expect(typeof queueMessage.fileSizeMb).toBe("number");
    });

})
