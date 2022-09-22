import { Logger } from "./core/logger";
import { ILoggable } from "./core/logger/abstracts/ILoggable";
import { Config } from "./models/config";

export class Core {
    private static logger: ILoggable | undefined;
    static getLogger(): ILoggable{
        if (this.logger != undefined)
            return this.logger;
        else
            throw new Error("Configuration not initialized");

    }

    static initialize(config: Config) {
        switch (config.provider) {
            case 'Azure':
                this.logger = new Logger(config);
                break;
            default:
                break;
        }
    }
}