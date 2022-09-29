import { describe } from "node:test";
import { QueueMessage } from "../core/queue";

// Create a queuemessage and print its value
let queuemessage = QueueMessage.from({
    message:'Sample message',
    messageId:'123',
    messageType:'sample-event',
    publishedDate: new Date(2022,5,18)
});

console.log('Published date is ');
let publishedDate = new Date(2022,5,18);
console.log(queuemessage.publishedDate);
console.log(publishedDate);
console.log(queuemessage.publishedDate.getTime() ==  publishedDate.getTime());