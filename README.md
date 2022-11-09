# Core package for microservice


## System requirements
| Software | Version|
|----|---|
| NodeJS | 16.17.0|
| Typescript | 4.8.2 |

## Starting a new project with template

- Add `nodets-ms-core` package as dependency in your `package.json`
- Start using the core packages in your code.

# Structure and components



## Core
Contains all the abstract and Azure implementation classes for connecting to Azure components.

## Initialize and Configuration
All the cloud connections are initialized with `initialize` function of core which takes an optional parameter of type `CoreConfig`. A `CoreConfig` takes only one parameter called `provider` which by default is set to `Azure`. The Core.initialize method can be called without any parameter or with a constructed CoreConfig object.

Eg.
```typescript
Core.initialize();
//or
Core.initialize(new CoreConfig(provider:"Azure"));

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

