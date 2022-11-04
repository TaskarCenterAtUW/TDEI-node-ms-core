import { ILoggerConfig } from "../../../models/abstracts/iloggerconfig";
import { Provider } from "../../../types/provider";

export class AzureLoggerConfig implements ILoggerConfig {
    provider: Provider = "Azure";
    loggerQueueName: string ;

    static default():AzureLoggerConfig {
        return new AzureLoggerConfig();
    }
    constructor(loggerQueueName:string = process.env.LOGGERQUEUE || "" ){
        this.loggerQueueName = loggerQueueName;
    }
}