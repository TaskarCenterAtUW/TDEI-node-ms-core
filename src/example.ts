// Testing code

import { ServiceBusClient, ServiceBusError } from "@azure/service-bus";
import client, { Channel, Connection } from "amqplib";
import { last } from "lodash";
import { Core } from "./core";
import { AuditEvent } from "./core/logger/model/audit_event";
import { AuditRequest } from "./core/logger/model/audit_request";
import { Queue, QueueMessage, When } from "./core/queue";
import { AzureQueueConfig } from "./core/queue/providers/azure-queue-config";
import { CoreConfig } from "./models/config";
import * as fs from 'fs';
import * as path from 'path';
import { LocalQueueConfig } from "./core/queue/providers/local/local-queue-config";
// Get the dotenv things
require('dotenv').config()


const delay = ms => new Promise(res=>setTimeout(res,ms));
let coreConfig = new CoreConfig("Local");
Core.initialize(coreConfig); // Pre-configures all the services required for the project.
console.log("Hello");
// Test the logs one by one
// let logger = Core.getLogger();

// logger.debug("This is a test debug message");
// logger.info("This is an info message");
// logger.getAnalytic()?.record({
//     orgId:'abc',
//     apiKeysIssued:2
// });

let auditRequest = AuditRequest.from({
    agencyId:'8383',
    requestId:'83832',
    resourceUrl:'/gtfs-flex/',
    responseStatus:'200',
    responseResult:'succeeded'
});
//  logger.getAuditor()?.addRequest(auditRequest);
// auditRequest.responseStatus = '201';
// logger.getAuditor()?.updateRequest(auditRequest);

// logger.getAuditor()?.addEvent(AuditEvent.from({
//     requestId:'83832',
//     requestInfo:{
//         fileInfo:'gtfs-path',
//         fileLocation:'/gtfs/path'
//     },
//     stage:'Initialized',
//     status:"OK"
// }));


// // logger
// logger.sendAll();
// https://tdeisamplestorage.blob.core.windows.net/gtfspathways/2022/NOVEMBER/102/
const storageClient = Core.getStorageClient();

async function testUpload(){
    const container = await storageClient?.getContainer('gone');
    const filetoUpload = container?.createFile('sample.txt','text/plain');
    const readStream = fs.createReadStream(path.join(__dirname,'core.js'));
    // Get the local stream and upload
    filetoUpload?.upload(readStream);
}

// testUpload();


//  storageClient?.getFile('gtfspathways','2022/NOVEMBER/102/file_1668600056782_bce3e0a8b6e94ce7a76ac94426c1be04.zip').then((fileEntity)=>{
//     console.log("Received file entity");
//     console.log(fileEntity.fileName);
//     console.log(fileEntity.mimeType);
//     // fileEntity.getStream().then((stream)=>{
//     //     console.log("Stream received");
//     // });

// }).catch((err)=>{
//     console.log('Error while getting the file information');
//     console.log(err);
// });
//https://tdeisamplestorage.blob.core.windows.net/gtfspathways/2022/NOVEMBER/102/file_1668600056782_bce3e0a8b6e94ce7a76ac94426c1be04.zip
// storageClient?.getFileFromUrl("https://tdeisamplestorage.blob.core.windows.net/gtfspathways/2022/NOVEMBER/102/file_1668600056782_bce3e0a8b6e94ce7a76ac94426c1be04.zip").then((fileEntity)=>{
//     console.log("Received file entity");
//     console.log(fileEntity.fileName);
//     console.log(fileEntity.mimeType);
//     // fileEntity.getStream().then((stream)=>{
//     //     console.log("Stream received");
//     // });

// }).catch((err)=>{
//     console.log('Error while getting the file information');
//     console.log(err);
// });


async function testTopic(){
    const topic = 'gtfs-flex-upload';
    const subscription = 'uploadprocessor';
    const topicConfig =  LocalQueueConfig.default();
    const topicObject = Core.getTopic(topic,topicConfig);
    await delay(1000);
    
    topicObject.subscribe(subscription,{
        onReceive: processMessage,
        onError:processError
    });
    await delay(1000);
    topicObject.publish(QueueMessage.from(
        {
            message:"Hello there from local"
        }
    ));

}

function processMessage(message:QueueMessage) {
    console.log("Received Message");
    console.log(message.toJSON());
    // return Promise.resolve();
}

function processError(error: any){
    console.log("Received error");
    // return Promise.reject();
}

testTopic();

/**
 * Testing for topics
 */
/*
// Some experiment regarding service bus and subscription.
const topic = "gtfs-flex-upload";
const subscription = "uploadprocessor";
const someOthersub = "usdufs";

const topicConfig = new AzureQueueConfig(); // Need to modify this somehow.

topicConfig.connectionString = process.env.PUBSUBCONNECTION as string;

const topicObject = Core.getTopic(topic,topicConfig);


function processMessage(message:QueueMessage) {
    console.log("Received Message");
    // return Promise.resolve();
}

function processError(error: any){
    console.log("Received error");
    // return Promise.reject();
}
topicObject.subscribe(subscription,{
    onReceive:processMessage,
    onError:processError
});



topicObject.publish(QueueMessage.from(
    {
        message:"Hello there"
    }
));
*/

/**
 * Internal section for logger testing
 */
// let coreLogger = Core.getLogger();

// coreLogger.info('One Information','another information');
// coreLogger.getAuditor()?.addRequest(auditRequest);

//  storageClient?.getContainer('gtfspathways').then((container)=>{
//     container.listFiles().then((files)=>{
//         console.log(files);
//         const lastFile = files[files.length -1];
//         lastFile.getStream().then(async (stream)=>{
//             stream.setEncoding('utf8');
//             let data = '';
//             for await (const chunk of stream) {
//                 data += chunk;
//             }
//             console.log(data);

//         });
//     });

// });


class CustomQueue extends Queue{

    // Add listener function to the event type `sampleevent`
    @When('sampletype')
    public onSampleEvent(message: QueueMessage){
        console.log('Received message');
        console.debug(message.messageId);
    }

}

// async function tryLocalMessages(){

// const connection : Connection = await client.connect('amqp://localhost');

// const channel: Channel = await connection.createChannel();

// const queueName: string = 'tdei-sample';
// await channel.assertQueue(queueName);

// channel.sendToQueue(queueName, Buffer.from('Hello there'));

// channel.consume(queueName,(msg)=>{
//     console.log('received message');
//     console.log(msg?.content.toString());
// },{noAck:true});

// }

// tryLocalMessages().then(()=>{
//     console.log('completed');
// }).catch((e)=>{
//     console.log('exception to be handled');
//     console.log(e);
// });



async function testMessages(){

    let queue = Core.getQueue('tdei-sample');
    const message = QueueMessage.from({
        messageId:'28282',
        message:'Sample message',
        messageType:'sampletype',
        data:{
            flexPath:'sdfs/sdfs/sds',
            isValid:true
        }
    });


    // Accessing or creating queueInstance

let customQueueObject = Core.getCustomQueue<CustomQueue>('tdei-sample',CustomQueue);
    await delay(1000); // Have to do without delay.
    customQueueObject.listen();
    queue.add(message);
    queue.send();


}
// testMessages();



