import { Core } from '../../core';
import { Config } from '../../models/config';
import { Queue, QueueMessage } from '../queue';
import { IAnalytics } from './abstracts/IAnalytics';
import { IAuditor } from './abstracts/IAuditor';
import { ILoggable } from './abstracts/ILoggable';
import { LoggerAbstract } from './abstracts/logger-abstract';
import { AppInsightsProvider } from './providers/appInsights-provider';
import { AzureAnalytic } from './providers/azure_analytic';
import { AzureAuditor } from './providers/azure_auditor';

export class Logger extends LoggerAbstract implements ILoggable {

  constructor(config : Config) {
    super();
    this.analyticQueue = Core.getQueue(config.cloudConfig.logQueue);
    this.initializeProvider(config);
  }
  
  
  private analyticQueue: Queue;
  
  sendAll(): void {
    // this.client.sendAll();
    this.analyticQueue.send();
  }

  recordRequest(req: any, res: any): void {
    // this.client.recordRequest(req, res);
    this.analyticQueue.add(QueueMessage.from(
      {
        messageType:'apiRequest',
        data:{
          req:req,
          res:res
        }
      }
    ));
  }

  protected initializeProvider(config : Config) {
    //Change this line in the case we want to change the logging provider
    // this.client = new AppInsightsProvider(config); // Not valid anymore   
    this.auditor = new AzureAuditor(config.cloudConfig.logQueue); // TO be done.
    this.analytic = new AzureAnalytic(config.cloudConfig.logQueue);
    
  }

  info(message?: any, ...optionalParams: any[]): void {
    // this.client.info(message,optionalParams);
    this.analyticQueue.add(QueueMessage.from(
      {
        messageType:"info",
        message:message
      }
    ));
  }
  debug(message?: any, ...optionalParams: any[]): void {
    // this.client.debug(message,optionalParams);
    this.analyticQueue.add(QueueMessage.from(
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
    this.analyticQueue.add(QueueMessage.from({
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
