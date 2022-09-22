import { Logger } from './abstracts/logger';
import { AppInsightsProvider } from './providers/appInsights-provider';

export class TDEILogger extends Logger {

  initializeProvider() {
    //Change this line in the case we want to change the logging provider
    this.client = new AppInsightsProvider();
  }
}
