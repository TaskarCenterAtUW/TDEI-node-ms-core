import { Core } from '../../core';
import { ILoggerConfig } from '../../models/abstracts/iloggerconfig';
import { Queue, QueueMessage } from '../queue';
import { IAnalytics } from './abstracts/IAnalytics';
import { IAuditor } from './abstracts/IAuditor';
import { ILoggable } from './abstracts/ILoggable';
import { LoggerAbstract } from './abstracts/logger-abstract';
import { AzureAnalytic } from './providers/azure_analytic';
import { AzureAuditor } from './providers/azure_auditor';
import { AzureLoggerConfig } from './providers/azure_logger_config';

export class Logger extends LoggerAbstract implements ILoggable {

  constructor(config : ILoggerConfig) {
    super();

    if(config.provider == "Azure"){
      const azureConfig = config as AzureLoggerConfig;
      this.logQueue = Core.getQueue(azureConfig.loggerQueueName);
      this.logQueue.enableAutoSend(2);
      console.log("Logger queue name "+azureConfig.loggerQueueName);
    }
    this.initializeProvider(config);
  }
  
  
  private logQueue: Queue | null = null;
  
  sendAll(): void {
    // this.client.sendAll();
    this.logQueue?.send();
  }

  recordRequest(req: any, res: any): void {
    // this.client.recordRequest(req, res);
    this.logQueue?.add(QueueMessage.from(
      {
        messageType:'apiRequest',
        data:{
          req:req,
          res:res
        }
      }
    ));
  }

  protected initializeProvider(config : ILoggerConfig) {
    //Change this line in the case we want to change the logging provider
    // this.client = new AppInsightsProvider(config); // Not valid anymore   
    if(config.provider == "Azure"){
      let azureConfig = config as AzureLoggerConfig;
      this.auditor = new AzureAuditor(azureConfig.loggerQueueName); // TO be done.
      this.analytic = new AzureAnalytic(azureConfig.loggerQueueName);
    }
    
  }

  info(message?: any, ...optionalParams: any[]): void {
    // this.client.info(message,optionalParams);
    this.logQueue?.add(QueueMessage.from(
      {
        messageType:"info",
        message:message
      }
    ));
  }
  debug(message?: any, ...optionalParams: any[]): void {
    // this.client.debug(message,optionalParams);
    console.log("Adding message");
    this.logQueue?.add(QueueMessage.from(
      {
        messageType:"debug",
        message:message
      }
    ));
  }

  recordMessage(message: QueueMessage): void {
    // this.client.recordMessage(message);
    // TODO
  }
 
  recordMetric(name: string, value: number): void {
    // this.client.recordMetric(name, value);
    this.logQueue?.add(QueueMessage.from({
      messageType:'metric',
      data: {
        name:name,
        value:value
      }
    }))
  }

  getAuditor(): IAuditor | null {
      return this.auditor;
  }

  getAnalytic(): IAnalytics | null {
      return this.analytic;
  }
}
