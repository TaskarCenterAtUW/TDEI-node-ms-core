import { IConfig } from "./models/abstracts/iconfig";
import { Logger } from "./core/logger";
import { ILoggable } from "./core/logger/abstracts/ILoggable";
import { Queue } from "./core/queue";
import { StorageClient } from "./core/storage";
import { AzureStorageClient } from "./core/storage/providers/azure/azure_storage_client";
import { Config } from "./models/config";
import { IQueueConfig } from "./models/abstracts/iqueueconfig";
import { IStorageConfig } from "./models/abstracts/istorageconfig";
import { AzureStorageConfig } from "./core/storage/providers/azure/azure_storage_config";

export class Core {
    private static logger: ILoggable | undefined;
    private static config: IConfig;

    static getLogger(): ILoggable{
        if (this.logger != undefined)
            return this.logger;
        else
            throw new Error("Configuration not initialized");

    }



    static initialize(config: IConfig) {
        switch (config.provider) {
            case 'Azure':
                this.config = config;    
                // this.logger = new Logger(config);
                break;
            case 'Local':
                console.log("Unimplemented initialization for core");
                break;
            default:
                break;
        }
    }

    static getCustomQueue<T extends Queue>(name:string, qInstance: {new (config: IQueueConfig,queueName:string):T}): T {
        return new qInstance(this.config,name);
    }

    static getQueue(name:string):Queue {
        return this.getCustomQueue<Queue>(name,Queue);
    }

    static getStorageClient(config: IStorageConfig|null = null): StorageClient | null{
        if(config == null){
            // figure out the configuration based on 
            // Default configuration
            if(this.config.provider == "Azure"){
                // Figure out and send the azure storage client
                return new AzureStorageClient(AzureStorageConfig.default());

            }
            else {
                console.log('Storage not configured for '+this.config.provider);
                return null;
            }
        }
        else{
            if(config.provider == "Azure"){
                if(config instanceof AzureStorageConfig){
                    return new AzureStorageClient(config);
                }
                else {
                    console.log("Provided configuration is mismatched");
                    console.log(config);
                    return null;
                }
            }
            else {
                console.log("No implementation for type "+config.provider);
                return null;
            }
        }
    }

    

    protected static checkHealth():void{
        console.log("Checking health for Core");
        console.log("Configured for "+this.config.provider);
    }

    
}