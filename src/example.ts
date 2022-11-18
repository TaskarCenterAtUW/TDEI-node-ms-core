// Testing code

import { Core } from "./core";
import { AuditEvent } from "./core/logger/model/audit_event";
import { AuditRequest } from "./core/logger/model/audit_request";
import { CoreConfig } from "./models/config";


// Get the dotenv things
require('dotenv').config()

// let coreConfig = new CoreConfig();
Core.initialize(); // Pre-configures all the services required for the project.
console.log("Hello");
// Test the logs one by one
// let logger = Core.getLogger();

// logger.debug("This is a test debug message");
// logger.info("This is an info message");
// logger.getAnalytic()?.record({
//     orgId:'abc',
//     apiKeysIssued:2
// });

// let auditRequest = AuditRequest.from({
//     agencyId:'8383',
//     requestId:'83832',
//     resourceUrl:'/gtfs-flex/',
//     responseStatus:'200',
//     responseResult:'succeeded'
// });
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
storageClient?.getFileFromUrl("https://tdeisamplestorage.blob.core.windows.net/gtfspathways/2022/NOVEMBER/102/file_1668600056782_bce3e0a8b6e94ce7a76ac94426c1be04.zip").then((fileEntity)=>{
    console.log("Received file entity");
    console.log(fileEntity.fileName);
    console.log(fileEntity.mimeType);
    // fileEntity.getStream().then((stream)=>{
    //     console.log("Stream received");
    // });

}).catch((err)=>{
    console.log('Error while getting the file information');
    console.log(err);
});