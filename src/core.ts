import { Logger } from "./core/logger";
import { ILoggable } from "./core/logger/abstracts/ILoggable";
import { Queue } from "./core/queue";
import { StorageClient } from "./core/storage";
import { AzureStorageClient } from "./core/storage/providers/azure/azure_storage_client";
import { Config } from "./models/config";

export class Core {
    private static logger: ILoggable | undefined;
    private static config: Config;

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
                this.config = config;
                break;
            default:
                break;
        }
    }

    static getCustomQueue<T extends Queue>(name:string, qInstance: {new (config: Config,queueName:string):T}): T {
        return new qInstance(this.config,name);
    }

    static getQueue(name:string):Queue {
        return this.getCustomQueue<Queue>(name,Queue);
    }

    static getStorageClient():StorageClient{
        return new AzureStorageClient(this.config.cloudConfig.connectionString.blobStorage);
    }

    
}