# Core package for microservice


## System requirements
| Software | Version|
|----|---|
| NodeJS | 16.17.0|
| Typescript | 4.8.2 |

## Starting a new project with template

- Add `nodets-ms-core` package as dependency in your `package.json`
- Start using the core packages in your code.


# Testing

The project is configured with `babel` to figure out the coverage of the unit tests. All the tests are in `test` folder. 
- To execute the tests, please follow the commands:


`npm install`

`npm run test`



- After the commands are run, you can check the coverage report in `coverage/lcov-report/index.html`. Open the file in any browser and it shows complete coverage details
- The terminal will show the output of coverage like this
```shell
> nodets-ms-core@0.0.8 test
> jest --silent

 PASS  test/local_logger.unit.ts
  Local logger
    ✓ Should initialize without parameters (2 ms)
    ✓ Should send add request (1 ms)
    ✓ Should be able to  update request (1 ms)
    ✓ Should be able to  add event (1 ms)
    ✓ Should be able to record metric
    ✓ Should record HTTP call
    ✓ Should send info (1 ms)
    ✓ Should send debug
    ✓ Should record message
    ✓ Should get Auditor

 PASS  test/queue-message.unit.ts
  QueueMessage
    ✓ Should create Queue appropriately (3 ms)
    ✓ Should Instantiate

 PASS  test/queue.unit.ts
  Queue 
    ✓ Should get the Azure Queue (4 ms)
    ✓ Should be able to add messages (1 ms)
    ✓ Should be able to send messages
    ✓ Should call listen messages

 PASS  test/azure_analytic.unit.ts
  Azure analytic
    ✓ Should initialize with queue name (1 ms)
    ✓ Should be able to send message (1 ms)

 PASS  test/topic.unit.ts
  Azure service bus topic
    ✓ Should have provider as azure (1 ms)
    ✓ Should get the service topic (1 ms)
    ✓ Should send message via ServiceBus when message is sent (2 ms)
    ✓ Should listen to the said subscription appropriately
    ✓ Should throw error when the client is not available (10 ms)
  Local topic
    ✓ Should have provider as Local
    ✓ Should get the service topic
    ✓ Should send message via ServiceBus when message is sent
    ✓ Should listen to the said subscription appropriately
    ✓ Should throw error when the client is not available

 PASS  test/azure_auditor.unit.ts
  Azure auditor
    ✓ Should initialize with queue name (8 ms)
    ✓ Should add event appropriately (1 ms)
    ✓ Should add request appropriately
    ✓ Should update request appropriately
    ✓ Should return object with empty queue also (1 ms)

 PASS  test/azure-service-bus-topic.unit.ts
  Azure service bus topic unit
    ✓ Should initialize with Azure default config if not provided (1 ms)
    ✓ Should have called and created topic and sender on init
    ✓ Should listen to a subscription using subscribe method
    ✓ Should be able to call publish on sender when message is sent (1 ms)

 PASS  test/azure_storage_container.unit.ts
  Azure Storage container
    ✓ Should be able to initialize from ContainerClient (1 ms)
    ✓ Should be able to list files based on response from azure (1 ms)
    ✓ Should be able to create a file with given name

 PASS  test/azure_storage_client.unit.ts
  Azure Storage Client
    ✓ Should initialize Client (1 ms)
    ✓ Should get Container with name
    ✓ Should get file from the container name and entity (1 ms)
    ✓ Should get file from URL

 PASS  test/local_file_entity.unit.ts
  Local file entity
    ✓ Should get the file appropriately
    ✓ Should get the file from axios (1 ms)
    ✓ Should get the data text (3 ms)
    ✓ Should upload from data (7 ms)

 PASS  test/local_storage_client.unit.ts
  Local storage client
    ✓ Should initialize Client appropriately
    ✓ Should return the container
    ✓ Should get file from container
    ✓ Should get the file from the URL (1 ms)
    ✓ Should throw a Not found error when not found (3 ms)

 PASS  test/logger.unit.ts
  Logger
    ✓ Should initialize with default configuration (4 ms)
    ✓ Should send info
    ✓ Should send debug (1 ms)
    ✓ Should send metric
    ✓ Should record HTTP call (1 ms)
    ✓ Should get auditor (1 ms)
    ✓ Should get analytic
    ✓ Should call send when sendAll called

 PASS  test/local_storage_container.unit.ts
  Local storage container
    ✓ Should be able to create with server root and name (1 ms)
    ✓ Should get list of files as given by server (1 ms)
    ✓ Should create a new file based on path

 PASS  test/azure_storage_config.unit.ts
  Azure storage config
    ✓ Should initialize with given parameters (2 ms)
    ✓ Should get the value of connection string from process (1 ms)
    ✓ Default should pick up from env

 PASS  test/local_storage_config.unit.ts
  Local Storage config
    ✓ Should initialize with no configuration given (2 ms)
    ✓ Should take the env connection
    ✓ Should take values from default when default is called (1 ms)

 PASS  test/azure_logger_config.unit.ts
  Azure logger Config
    ✓ Should have provider as azure (1 ms)
    ✓ Should pickup queuename from local configuration (1 ms)
    ✓ Should pickup queuename from parameter

 PASS  test/azure_file_entity.unit.ts
  Azure file entity
    ✓ Should be able to initialize (1 ms)
    ✓ Should be able to download when the file stream is needed (1 ms)
    ✓ Should be able to get the text (1 ms)
    ✓ Should be able to upload the content from readable stream (1 ms)

 PASS  test/core_config.unit.ts
  Core Configuration
    ✓ Should initialize Core default with Azure (1 ms)
    ✓ Should initialize Core default based on env variable (2 ms)

 PASS  test/core.unit.ts
  Core unit tests
    ✓ Should initialize with default configuration (11 ms)
    ✓ Should initialize with Local Configuration
    ✓ Should get default storage client by default (1 ms)
    ✓ Should get Local storage client for local configuration
    ✓ Should get Local storage client for local Configuration
    ✓ Should get Azure storage client for azure config (1 ms)
    ✓ Should return Local storage client if core initialized by local and default storage requested
    ✓ Should get Azure logger by default
    ✓ Should return local logger for local
    ✓ Should return Hosted Authorizer if provider not given (1 ms)

 PASS  test/local-topic.unit.ts
  Local topic unit test
    ✓ Should initialize with any config (1 ms)
    ✓ Should initialize without any config
    ✓ Should publish message to channel with publish (302 ms)
    ✓ Should consume from the channel with consume (308 ms)

 PASS  test/authorizer.int.ts (6.682 s)
  Authorizer (Hosted and Simulated)
    ✓ Should give HostedAuthorizer for configuration (1 ms)
    ✓ Should give SimulatedAuthorizer for configuration
    ✓ Should pick up host url from env if not given (4 ms)
    ✓ Should configure based on the url provided (1 ms)
    ✓ Should give error for no permissions (2 ms)
    ✓ Should give simulated result as expected (false) 
    ✓ Should give simulated result as expected (true)
    ✓ Should respond true when user has permission (1418 ms)
    ✓ Should respond false if user does not have permission (1195 ms)
    ✓ Should respond true if user has all the permissions required (1243 ms)
    ✓ Should reject if the URL is malformed (47 ms)

----------------------------------|---------|----------|---------|---------|-----------------------------------------------------------
File                              | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                         
----------------------------------|---------|----------|---------|---------|-----------------------------------------------------------
All files                         |   74.52 |    61.59 |   72.86 |   74.44 |                                                           
 src                              |   77.77 |    68.18 |     100 |   77.77 |                                                           
  core.ts                         |   77.77 |    68.18 |     100 |   77.77 | 30,41,60,76,96-97,105-111,121-122,152,163-168,186,197,204 
 src/core/auth/model              |     100 |      100 |     100 |     100 |                                                           
  auth_config.ts                  |     100 |      100 |     100 |     100 |                                                           
  permission_request.ts           |     100 |      100 |     100 |     100 |                                                           
 src/core/auth/provider/hosted    |     100 |      100 |     100 |     100 |                                                           
  hosted_authorizer.ts            |     100 |      100 |     100 |     100 |                                                           
 src/core/auth/provider/simulated |     100 |      100 |     100 |     100 |                                                           
  simulated_authorizer.ts         |     100 |      100 |     100 |     100 |                                                           
 src/core/logger                  |     100 |    76.19 |    90.9 |     100 |                                                           
  index.ts                        |     100 |      100 |     100 |     100 |                                                           
  logger.ts                       |     100 |    76.19 |      90 |     100 | 23-28,57-82                                               
 src/core/logger/abstracts        |     100 |      100 |     100 |     100 |                                                           
  logger-abstract.ts              |     100 |      100 |     100 |     100 |                                                           
 src/core/logger/model            |     100 |      100 |     100 |     100 |                                                           
  audit_event.ts                  |     100 |      100 |     100 |     100 |                                                           
  audit_request.ts                |     100 |      100 |     100 |     100 |                                                           
 src/core/logger/providers        |     100 |    81.25 |     100 |     100 |                                                           
  azure_analytic.ts               |     100 |      100 |     100 |     100 |                                                           
  azure_auditor.ts                |     100 |    76.92 |     100 |     100 | 18-41                                                     
  azure_logger_config.ts          |     100 |      100 |     100 |     100 |                                                           
 src/core/logger/providers/local  |   85.18 |      100 |      80 |   85.18 |                                                           
  local_logger.ts                 |   85.18 |      100 |      80 |   85.18 | 59,82,96-97                                               
 src/core/queue                   |   77.77 |    58.82 |   73.33 |   76.47 |                                                           
  index.ts                        |     100 |      100 |   66.66 |     100 |                                                           
  queue.ts                        |   62.96 |    36.36 |    62.5 |   62.96 | 24,32,40-41,50,55-67                                      
  topic.ts                        |   90.47 |      100 |     100 |   90.47 | 41,48                                                     
 src/core/queue/abstracts         |     100 |      100 |     100 |     100 |                                                           
  message-queue.ts                |     100 |      100 |     100 |     100 |                                                           
  message-topic.ts                |     100 |      100 |     100 |     100 |                                                           
 src/core/queue/decorators        |      25 |        0 |       0 |      25 |                                                           
  when.decorator.ts               |      25 |        0 |       0 |      25 | 8-13                                                      
 src/core/queue/models            |     100 |      100 |     100 |     100 |                                                           
  queue-message.ts                |     100 |      100 |     100 |     100 |                                                           
 src/core/queue/providers         |   35.38 |       50 |   29.41 |   35.93 |                                                           
  azure-queue-config.ts           |     100 |      100 |     100 |     100 |                                                           
  azure-service-bus-queue.ts      |   10.25 |        0 |       0 |   10.52 | 12-98                                                     
  azure-service-bus-topic.ts      |   68.18 |       80 |      60 |   68.18 | 33-40,46                                                  
 src/core/queue/providers/local   |   40.57 |    44.89 |   38.88 |   41.17 |                                                           
  local-queue-config.ts           |     100 |      100 |     100 |     100 |                                                           
  local-queue.ts                  |      10 |        0 |       0 |   10.25 | 18-94                                                     
  local-topic.ts                  |      80 |    74.07 |   83.33 |      80 | 42-48                                                     
 src/core/storage/providers/azure |   88.88 |    66.66 |   95.23 |   89.85 |                                                           
  azure_file_entity.ts            |   91.66 |      100 |     100 |   95.45 | 70                                                        
  azure_storage_client.ts         |   78.57 |        0 |    87.5 |   78.57 | 48-59                                                     
  azure_storage_config.ts         |     100 |      100 |     100 |     100 |                                                           
  azure_storage_container.ts      |     100 |      100 |     100 |     100 |                                                           
 src/core/storage/providers/local |   97.22 |      100 |   91.66 |   97.14 |                                                           
  local_file_entity.ts            |     100 |      100 |     100 |     100 |                                                           
  local_storage_client.ts         |   95.83 |      100 |   88.88 |   95.83 | 37                                                        
  local_storage_config.ts         |     100 |      100 |     100 |     100 |                                                           
  local_storage_container.ts      |   94.11 |      100 |    87.5 |   93.75 | 36                                                        
 src/decorators                   |   59.09 |    31.25 |      25 |      55 |                                                           
  nested-model.decorator.ts       |   30.76 |        0 |       0 |      25 | 17-33,45-48                                               
  prop.decorator.ts               |     100 |    83.33 |     100 |     100 | 33                                                        
 src/models                       |     100 |      100 |      80 |     100 |                                                           
  config.ts                       |     100 |      100 |     100 |     100 |                                                           
  index.ts                        |     100 |      100 |   66.66 |     100 |                                                           
 src/models/base                  |   53.42 |     61.9 |   56.25 |   54.16 |                                                           
  abstract-domain-entity.ts       |   53.42 |     61.9 |   56.25 |   54.16 | 56,71-85,137,140,157-226                                  
 src/utils/resource-errors        |      84 |       70 |      75 |      84 |                                                           
  abstract-resource-error.ts      |   81.25 |       70 |     100 |   81.25 | 47,52,56                                                  
  bad-request-resource-error.ts   |     100 |      100 |     100 |     100 |                                                           
  not-found-resource-error.ts     |     100 |      100 |     100 |     100 |                                                           
  unprocessable-resource-error.ts |   66.66 |      100 |       0 |   66.66 | 5                                                         
 test                             |   84.21 |      100 |   72.72 |   84.21 |                                                           
  azure.mock.ts                   |     100 |      100 |     100 |     100 |                                                           
  rabbitmq.mock.ts                |   66.66 |      100 |   57.14 |   66.66 | 7,72-78                                                   
----------------------------------|---------|----------|---------|---------|-----------------------------------------------------------
Test Suites: 21 passed, 21 total
Tests:       104 passed, 104 total
Snapshots:   0 total
Time:        7.001 s

```


# Structure and components



## Core
Contains all the abstract and Azure implementation classes for connecting to Azure components.

## Initialize and Configuration
All the cloud connections are initialized with `initialize` function of core which takes an optional parameter of type `CoreConfig`. A `CoreConfig` takes only one parameter called `provider` which by default is set to `Azure`. The Core.initialize method can be called without any parameter or with a constructed CoreConfig object.

Eg.
```typescript
Core.initialize();
//or
Core.initialize(new CoreConfig());

```
The method analyzes the `.env` variables and does a health check on what components are available

## Setting up local connections
`Core` works with all the default options and wherever required, relies on environment variables for connecting. The environment variables can be accessed either by setting them in the local machine or by importing via `dotenv` package which reads from a `.env` file created in the source code. All the variables in the `.env` file are optional. However, some of them will be needed inorder for the specific features to work.

Here is the structure 

```shell
# Provider information. Only two options available Azure and Local
# Defaults to Azure if not provided
PROVIDER=Azure 

# Connection string to queue. 
# Optional. Logger functionality for Azure may not work 
# if not provided
QUEUECONNECTION=
# connection string to Azure storage if the provider is Azure
# Same can be used for root folder in Local provider
STORAGECONNECTION=
# Name of the queue that the logger writes to.
# This is optional and defaults value tdei-ms-log
LOGGERQUEUE=

```
This file will have to be generated or shared offline as per the developer requirement.

### Logger
Offers helper classes to help log the information. It is also used to record the audit messages
as well as the analytics information required.

Use `Core.getLogger()` to log the following

`queueMessage`  : Message received or sent to Queues. This helps in keeping track of the messages received and sent from the queue.

`metric`    : Any specific metric that needs to be recorded

`request` : App HTTP request that needs to be logged (for response time, path, method and other information)

Audit messages are logged using the `Core.getLogger().getAuditor()` method. This provides an instance 
of auditor which can perform the following operations

`addRequest` : Adds request for auditing
`updateRequst` : Updates a given request
`addEvent` : Adds a specific event to the request (tree heirarchy)
`updateEvent`: Updates the given audit event.
The complete details are available at [Logger flow](https://dev.azure.com/TDEI-UW/TDEI/_git/internaldocs?path=/adr/logger-flow.md&_a=preview)

Eg.
```typescript

let tdeiLogger = Core.getLogger();
// Record message
tdeiLogger.recordMessage(queueMessage, true); // True if published and false if received

// Record a metric
tdeiLogger.recordMetric('userlogin',1); // Metric and value

// Record a request
tdeiLogger.recordRequest(request,response);

```
Note:

* All the `debug`, `info`, `warn`, `error` logs can be logged with `console` and will be injected into appInsight traces.
* All the requests of the application can be logged by using `requestLogger` (check `index.ts`). This acts as a middleware for logging all the requests
* All the QueueMessages received and sent within the application are already logged. You may use the above methods just in case there is more information to be logged.

### Model
Offers easy ways to define and parse the model classes from the JSON based input received from either HTTP request or from the queue message. This acts as the base for defining all the models. `AbstractDomainEntity` can be subclassed and used for all the models used within the project. This combined with `Prop()` decorator will make it easy for modelling.

Eg.
```typescript

class SampleModel extends AbstractDomainEntity{

    @Prop()
    public userid!: string;

    @Prop()
    public extraThing!: string

    constructor() {
        super();
      }

}
```
The above class loads the entity from json file with the following format
```json
{
    "userid":"sample-user-id",
    "extraThing":"some-extra-information"
}
```

Another example is the base queue message used within the core:
```typescript
export class QueueMessage extends AbstractDomainEntity {
    
    /**
     * Unique message ID to represent this message
     */
    @Prop()
    messageId!:string;

    /**
     * Message type for this queue message
     */
    @Prop()
    messageType!:string;

    /**
     * Optional message string for the message
     */
    @Prop()
    message:string | undefined;

}

```

NOTE: In future, there will be other decorators in place based on the need.
Eg. @Validate, @UUID, @Required

These will help in easily modelling the classes along with the required validation.

### Queue
Queue component offers easy way to listen to and send messages over Azure Queues/Cloud queues.

All the queue messages have to be derived from the base class `QueueMessage` which has some inherent properties that may be filled (eg. messageType is needed).

### Accessing specific queue
All the interactions will be handled by the class `Queue` which can be initialized with `Core`

```typescript
    let sampleQueue = Core.getQueue('name');
```

### Sending message to queue

Use the `send` method in `Queue` to send the message
```typescript
let sampleQueue = Core.getQueue('name');
const queueMessage = QueueMessage.from({messageType:'sampleevent',messageId:'1',message:"Sample message",publishedDate: new Date(2022,7,13)});
sampleQueue.send([queueMessage]);
```


### Listening to message queue
Inorder to listen to messages, use `@When` decorator in a `Queue` subclass and create methods appropriately.
However, the object will be got by `getCustomQueue` method of `Core`

```typescript
// Example of custom Queue implementation
class CustomQueue extends Queue{

    // Add listener function to the event type `sampleevent`
    @When('sampleevent')
    public onSampleEvent(message: QueueMessage){
        console.log('Received message');
        console.debug(message.messageId);
    }

}

// Accessing or creating queueInstance

let customQueueObject = Core.getCustomQueue<CustomQueue>('queueName',CustomQueue);


```

### Topic
Topic is an advanced version of Queue where the messages are published and subscribed. Each message published to a topic can be subscribed 
by multiple parties for their own analysis and purpose. The messages sent and received via a topic will still be of type `QueueMessage`

The configuration required by Queue and Topic is similar and will be handled via a connection string.

### Accessing a specific topic

Topic can be accessed by the core method `getTopic`. This method takes two parameters 
1. topic name (required)
2. configuration (derived from IQueueConfig)
```typescript
const topic = Core.getTopic('topicName');
// Alternative
const topicConfig = new AzureQueueConfig(); // Need to modify this somehow.

topicConfig.connectionString = "connectionString";

const topicObject = Core.getTopic(topicConfig,topic);

```

### Publishing message to topic

Once the topic object is got, use `publish` method to publish the message to topic. 
```typescript
topicObject.publish(QueueMessage.from(
    {
        message:"Test message"
    }
));

```

### Subscribing to topic
An active subscription will listening to a subscription over the topic. This is achieved by using `subscribe` method of `Topic`.
It takes two parameters
1. subscription name
2. handler interface object (for when message is received and when there is an error)

```typescript

function processMessage(message:QueueMessage) {
    console.log("Received Message");
    console.log(message);
}

function processError(error: any){
    console.log("Received error");
}

topicObject.subscribe(subscription,{
    onReceive:processMessage,
    onError:processError
});

```

### Storage
For all the azure blobs and other storages, storage components will offer simple ways to upload/download and read the existing data.
```typescript
// Create storage client
const storageClient: StorageClient =  Core.getStorageClient();

// Get a container in the storage client
const storageContaiener: StorageContainer = await storageClient.getContainer(containerName);

// To get the list of files
const filesList:FileEntity[] = await storageContaiener.listFiles();

```
There are two ways to fetch the content of the file.
1. ReadStream - use `file.getStream()` which gives a `NodeJS.ReadableStream` object 
2. GetText - use `file.getText()` which gives a `string` object containing all the data of the file in `utf-8` format.

File upload is done only through read stream.
```typescript
// Get the storage container
const storageContainer: StorageContainer = await storageClient.getContainer(containerName);
    // Create an instance of `AzureFileEntity` with name and mime-type
    const testFile = storageContainer.createFile('sample-file2.txt','text/plain');
    // Get the read stream from the local file
    const readStream = fs.createReadStream(path.join(__dirname,"assets/sample_upload_file.txt"));
    // Call the upload method with the readstream.
    testFile.upload(readStream);
```

### Authorization

Core offers a simple way of verifying the authorization of a user and their role. 

Checking the permission involves three steps
1. Preparing a permission request object
2. Getting an authorizer object from core
3. Requesting if the permission is valid/true

#### Preparing the permission request
Core exposes class `PermissionRequest` that can be initialized as below
```ts
var permissionRequest = new PermissionRequest({
        userId:"<userID>",
        orgId:"<orgID>",
        permssions:["permission1","permission2"],
        shouldSatisfyAll:false 
     });
```
In the above example, `shouldSatisfyAll` helps in figuring out if all of the permissions are needed or any one of the permission is sufficient.

#### Getting the authorizer from core

Core exposes `getAuthorizer` method with `IAuthConfig` parameter.
There are two types of `Authorizer` objects in core. 
1. HostedAuthorizer : checks the permissions against a hosted API
2. SimulatedAuthorizer: makes a simulated authorizer used for local/non-hosted environment.

The following code demostrates getting the simulated and hosted authorizer
```ts
    const hostedAuthProvider = Core.getAuthorizer({provider:"Hosted",apiUrl:"<auth api url>"}); // Fetches hosted provider

    const simulatedAuthProvider = Core.getAuthorizer({provider:"Simulated"}); // Fetches simulated provider

```
In case `apiUrl` is not provided for `Hosted` auth provider, the core will pick it up from environment variable `AUTHURL`


#### Requesting if certain permission is valid:

From the `IAuthorizer` object received from the above, use the method `hasPermission(request)` to know if the permission request is valid/not.

```ts

/// Complete code example
 var permissionRequest = new PermissionRequest({
        userId:"<userID>",
        orgId:"<orgId>",
        permssions:["permission1"],
        shouldSatisfyAll:false
     });
  // With hosted provider 
    const authProvider = Core.getAuthorizer({provider:"Hosted",apiUrl:"<auth api URL>"});
    
    const response = await authProvider?.hasPermission(permissionRequest);
    // response will be boolean

// With simulated provider
    const simulatedProvider = Core.getAuthorizer({provider:"Simulated"});
    const response2 = await simulatedProvider?.hasPermission(permissionRequest);
// User id with "000000-0000-0000-0000-000000" will simulate result to false else true otherwise.
    permissionRequest.userId = "000000-0000-0000-0000-000000";
    const response3 = await simulatedProvider?.hasPermission(permissionRequest);

```

#### How does simualted authentication work?
With simulated authentication, the method `hasPermission` simply returns the value given in `shouldSatisfyAll` property in the permission request.

