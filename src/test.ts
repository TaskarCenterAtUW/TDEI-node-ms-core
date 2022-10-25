// Testing code

import { Core } from "./core";
import { AuditEvent } from "./core/logger/model/audit_event";
import { AuditRequest } from "./core/logger/model/audit_request";
import { Config } from "./models/config";

let configuration = Config.from({
    provider:'Azure', // default
    cloudConfig:{
        connectionString:{
            appInsights:"InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/",
            serviceBus:"Endpoint=sb://tdei-sample.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=4UNDrVpThcnbqWlGFFQEcivuPlvMMWcSHwbyHgEv+rg="
        },
        logQueue:'tdei-ev-logger'
    }
});

// connections:{
//     serviceBus: "Endpoint=sb://tdei-sample.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=4UNDrVpThcnbqWlGFFQEcivuPlvMMWcSHwbyHgEv+rg=",
//     blobStorage:"DefaultEndpointsProtocol=https;AccountName=tdeisamplestorage;AccountKey=l9JSJCGq9NrXqRVKApSk1wwV27aWaOVuxeY0NWOZz2svIlJzyncr3UFTzLoAanFbmJIeb2WmwIcS+AStj5gELg==;EndpointSuffix=core.windows.net",
//     appInsights:"InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/"
// },
// queueName:"tdei-poc-queue",
// blobContainerName:"tdei-storage-test",
// appName: process.env.npm_package_name

Core.initialize(configuration); // Pre-configures all the services required for the project.

// Test the logs one by one
let logger = Core.getLogger();

logger.debug("This is a test debug message");
logger.info("This is an info message");
logger.getAnalytic()?.record({
    orgId:'abc',
    apiKeysIssued:2
});

let auditRequest = AuditRequest.from({
    agencyId:'8383',
    requestId:'83832',
    resourceUrl:'/gtfs-flex/',
    responseStatus:'200',
    responseResult:'succeeded'
});
logger.getAuditor()?.addRequest(auditRequest);
auditRequest.responseStatus = '201';
logger.getAuditor()?.updateRequest(auditRequest);
logger.getAuditor()?.addEvent(AuditEvent.from({
    requestId:'83832',
    requestInfo:{
        fileInfo:'gtfs-path',
        fileLocation:'/gtfs/path'
    },
    stage:'Initialized',
    status:"OK"
}));


// logger
logger.sendAll();