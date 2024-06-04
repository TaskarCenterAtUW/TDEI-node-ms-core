// Testing code

import { Core } from "./core";
import { AuditRequest } from "./core/logger/model/audit_request";
import { Queue, QueueMessage, When } from "./core/queue";
import { CoreConfig } from "./models/config";
import * as fs from 'fs';
import * as path from 'path';
import { LocalQueueConfig } from "./core/queue/providers/local/local-queue-config";
import { PermissionRequest } from "./core/auth/model/permission_request";
import { Readable } from "stream";
// Get the dotenv things
require('dotenv').config()


const delay = ms => new Promise(res => setTimeout(res, ms));
let coreConfig = new CoreConfig("Azure");
Core.initialize(coreConfig); // Pre-configures all the services required for the project.
// Test the logs one by one
// let logger = Core.getLogger();

// logger.debug("This is a test debug message");
// logger.info("This is an info message");
// logger.getAnalytic()?.record({
//     projectGroupId:'abc',
//     apiKeysIssued:2
// });

let auditRequest = AuditRequest.from({
    projectGroupId: '8383',
    requestId: '83832',
    resourceUrl: '/gtfs-flex/',
    responseStatus: '200',
    responseResult: 'succeeded'
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

async function testUpload() {
    const container = await storageClient?.getContainer('gtfsflex');
    const filetoUpload = container?.createFile('tests/success_1_all_attrs.zip', 'application/zip');
    const readStream = fs.createReadStream(path.join(__dirname, 'core.js'));
    // Get the local stream and upload
    filetoUpload?.upload(readStream);
}

async function testUploadStream() {
    const container = await storageClient?.getContainer('gtfsflex');
    const filetoUpload = container?.createFile('tests/success_1_all_attrs.zip', 'application/zip');
    const readStream = fs.createReadStream(path.join(__dirname, 'core.js'));
    // Get the local stream and upload
    filetoUpload?.uploadStream(readStream);
}

async function testStorage() {
    const container = await storageClient?.getContainer('gone');
    let files = await container?.listFiles();
    files?.forEach((entity) => {
        console.log(entity.filePath);
    });
    //gone/abc/adr-log-flow-1.jpg
}
// testStorage();

async function testStorageFile() {
    let theFile = await storageClient?.getFile('gone', 'abc/adr-log-flow-1.jpg');
    console.log(theFile?.filePath);
    let theOtherFile = await storageClient?.getFileFromUrl('http://localhost:8801/gone/abc/adr-log-flow-1.jpg');
    console.log(theOtherFile?.filePath);
}

// testStorageFile()
// testUpload();

// Gets the file in the path
async function testDownload() {
    storageClient?.getFile('osw', '2024/4/d8271b7d-a07f-4bc9-a0b9-8de864464277/cdfe4f30f8f54d7390fb2fef24da8fe1/wa.seattle.zip').then(async (fileEntity) => {
        // storageClient?.getFile('osw', '2024/4/9f420393-531c-45d0-8628-d3a8336120df/62528b5733764c0880f405fbf728b74d/d441.zip').then(async (fileEntity) => {
        console.log("Received file entity");
        console.log(fileEntity.fileName);
        console.log(fileEntity.mimeType);

        // let readable = Readable.from(await fileEntity.getStream());
        let readable = await fileEntity.getStream();

        // Specify the path where you want to write the file

        const filePath = './downloaded.zip';
        // fs.rm(filePath);

        // Create a writable stream to the file
        const writableStream = fs.createWriteStream(filePath);

        // Pipe the data from the Readable stream to the Writable stream
        readable.pipe(writableStream);

        // Optional: Listen for events to handle errors or completion
        writableStream.on('error', (error) => {
            console.error('Error writing to file:', error);
        });

        writableStream.on('finish', () => {
            console.log('File write completed');
        });

        // fileEntity.getStream().then((stream) => {
        //     console.log("Stream received");
        // });

    }).catch((err) => {
        console.log('Error while getting the file information');
        console.log(err);
    });
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
}
//testDownload();


async function testCloneFile() {
    await storageClient?.cloneFile("https://tdeisamplestorage.blob.core.windows.net/osw/backend-jobs/1/edges.OSW.geojson", "streams", "backend-jobs/1/edges.OSW.geojson").then((fileEntity) => {
        console.log("Received file entity");
        console.log(fileEntity.fileName);
        console.log(fileEntity.mimeType);
    });
}
// testCloneFile();

async function testDeleteFile() {
    const container = await storageClient?.getFileFromUrl('https://tdeisamplestorage.blob.core.windows.net/streams/backend-jobs/1/edges.OSW.geojson');
    container?.deleteFile();
}
testDeleteFile();

async function testTopic() {
    const topic = 'gtfs-flex-upload';
    const subscription = 'uploadprocessor';
    const topicConfig = LocalQueueConfig.default();
    const topicObject = Core.getTopic(topic, topicConfig);
    await delay(1000);

    topicObject.subscribe(subscription, {
        onReceive: processMessage,
        onError: processError
    });
    await delay(1000);
    topicObject.publish(QueueMessage.from(
        {
            message: "Hello there from local"
        }
    ));

}

function processMessage(message: QueueMessage) {
    console.log("Received Message");
    console.log(message.toJSON());
    // return Promise.resolve();
}

function processError(error: any) {
    console.log("Received error");
    // return Promise.reject();
}

// testTopic();

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


class CustomQueue extends Queue {

    // Add listener function to the event type `sampleevent`
    @When('sampletype')
    public onSampleEvent(message: QueueMessage) {
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



async function testMessages() {

    let queue = Core.getQueue('tdei-sample');
    const message = QueueMessage.from({
        messageId: '28282',
        message: 'Sample message',
        messageType: 'sampletype',
        data: {
            flexPath: 'sdfs/sdfs/sds',
            isValid: true
        }
    });


    // Accessing or creating queueInstance

    let customQueueObject = Core.getCustomQueue<CustomQueue>('tdei-sample', CustomQueue);
    await delay(1000); // Have to do without delay.
    customQueueObject.listen();
    queue.add(message);
    queue.send();


}
// testMessages();

// Testing for authorization.
async function testAuthorization() {

    var permissionRequest = new PermissionRequest({
        userId: "7961d767-a352-464f-95b6-cd1c5189a93c",
        projectGroupId: "5e339544-3b12-40a5-8acd-78c66d1fa981",
        permssions: ["poc"],
        shouldSatisfyAll: false
    });
    // Alternative way of getting authorizer with url and provider
    // const aProvider = Core.getAuthorizer({provider:"Hosted"});// Picks from env

    const authProvider = Core.getAuthorizer({ provider: "Hosted", apiUrl: process.env.AUTHURL?.toString()! });

    const response = await authProvider?.hasPermission(permissionRequest);

    console.log(response);
}
// testAuthorization();


