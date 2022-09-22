# Core package for microservice


## System requirements
| Software | Version|
|----|---|
| NodeJS | 16.17.0|
| Typescript | 4.8.2 |

## Starting a new project with template

- Add `node-ms-core` package as dependency in your `package.json`
- Start using the core packages in your code.

# Structure and components



## Core
Contains all the abstract and Azure implementation classes for connecting to Azure components. 

### Logger
Offers helper classes to help log the information.
Use `Core.getLogger()` to log the following

`queueMessage`  : Message received or sent to Queues. This helps in keeping track of the messages received and sent from the queue.

`metric`    : Any specific metric that needs to be recorded

`request` : App HTTP request that needs to be logged (for response time, path, method and other information)

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
Queue component offers easy way to listen to and send messages over Azure Queues.
All the queue messages have to be derived from the base class `QueueMessage` which has some inherent properties that may be filled (eg. messageType is needed).

Documentation pending

https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

