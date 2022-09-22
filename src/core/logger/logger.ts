import { ILoggable } from './abstracts/ILoggable';
import { LoggerAbstract } from './abstracts/logger-abstract';
import { AppInsightsProvider } from './providers/appInsights-provider';

export class Logger extends LoggerAbstract implements ILoggable {

  constructor() {
    super();
    this.initializeProvider();
  }
 
  recordMetric(name: string, value: number): void {
    this.client.recordMetric(name, value);
  }

  sendAll(): void {
    this.client.sendAll();
  }

  recordRequest(req: any, res: any): void {
    this.client.recordRequest(req, res);
  }

  protected initializeProvider() {
    //Change this line in the case we want to change the logging provider
    this.client = new AppInsightsProvider();
  }
}
