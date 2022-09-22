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


https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

