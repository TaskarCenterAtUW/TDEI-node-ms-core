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