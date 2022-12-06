import { IConfig } from "./models/abstracts/iconfig";
import { Logger } from "./core/logger";
import { ILoggable } from "./core/logger/abstracts/ILoggable";
import { Queue } from "./core/queue";
import { StorageClient } from "./core/storage";
import { AzureStorageClient } from "./core/storage/providers/azure/azure_storage_client";
import { CoreConfig } from "./models/config";
import { IQueueConfig } from "./models/abstracts/iqueueconfig";
import { IStorageConfig } from "./models/abstracts/istorageconfig";
import { AzureStorageConfig } from "./core/storage/providers/azure/azure_storage_config";
import { AzureLoggerConfig } from "./core/logger/providers/azure_logger_config";
import { Topic } from "./core/queue/topic";
import { LocalLogger } from "./core/logger/providers/local/local_logger";
import { LocalStorageClient } from "./core/storage/providers/local/local_storage_client";

export class Core {
    private static logger: ILoggable | undefined;
    private static config: IConfig;

    static getLogger(): ILoggable {
        if (this.logger !== undefined)
            return this.logger;
        else {
            if (this.config.provider === "Azure") {
                this.logger = new Logger(new AzureLoggerConfig());
                return this.logger;
            }
            else if(this.config.provider == 'Local') {
                this.logger = new LocalLogger();
                return this.logger;
            }
            else {
                throw new Error("Configuration not initialized");
            }
        }

    }



    static initialize(config: IConfig = CoreConfig.default()): boolean {
        switch (config.provider) {
            case 'Azure':
                this.config = config;
                // this.logger = new Logger(config);
                break;
            case 'Local':
                console.error("Unimplemented initialization for core " + config.provider);
                break;
            default:
                break;
        }
        return this.checkHealth();
    }

    static getCustomQueue<T extends Queue>(name: string, qInstance: new (config: IQueueConfig, queueName: string) => T): T {
        return new qInstance(this.config, name);
    }

    static getQueue(name: string): Queue {
        return this.getCustomQueue<Queue>(name, Queue);
    }


    static getTopic( topicName: string,qconfig: IQueueConfig | null = null) {
        if (qconfig == null) {
            return new Topic(this.config, topicName);
        }
        else {
            return new Topic(qconfig, topicName);
        }
    }

    static getStorageClient(config: IStorageConfig | null = null): StorageClient | null {
        if (config == null) {
            // figure out the configuration based on
            // Default configuration
            if (this.config.provider === "Azure") {
                // Figure out and send the azure storage client
                return new AzureStorageClient(AzureStorageConfig.default());

            }
            else if(this.config.provider == 'Local'){
                return new LocalStorageClient(); // yet to get things moving.
            }   
            else {
                console.error('Storage not configured for ' + this.config.provider);
                return null;
            }
        }
        else {
            if (config.provider === "Azure") {
                if (config instanceof AzureStorageConfig) {
                    return new AzureStorageClient(config);
                }
                else {
                    console.debug("Provided configuration is mismatched");
                    console.debug(config);
                    return null;
                }
            }
            else {
                console.error("No implementation for type " + config.provider);
                return null;
            }
        }
    }



    protected static checkHealth(): boolean {
        console.log(`\x1b[32m ------------------------- \x1b[0m`);
        console.log(`\x1b[30m\x1b[42m PERFORMING CORE-HEALTH-CHECK \x1b[0m`);

        if (this.config == null) {
            console.log("Unknown/Unimplemented provider");
            console.log(`\x1b[31m Unknown/Unimplemented provider. Please check the provider supplied \x1b[0m`);
            console.log(`\x1b[33m Valid providers are \x1b[0m`);
            console.log(`\x1b[32m Azure \x1b[0m`);

            return false;
        }
        console.log("Configured for \x1b[32m " + this.config.provider + " \x1b[0m \n");


        if (this.config.provider == "Azure") {
            // check for the following process variables
            const loggerQueueName = process.env.LOGGERQUEUE;
            const queueConnection = process.env.QUEUECONNECTION;
            const storageConnection = process.env.STORAGECONNECTION;
            //\\x1b[30m $1 \\x1b[0m
            console.log("\x1b[31m > Checking Queue Connections\x1b[0m",);
            if (!queueConnection) {
                console.log(`\x1b[33m Queue connection not available by default \x1b[0m`);
                console.log(`\x1b[33m Please configure QUEUECONNECTION in .env file to ensure queue communication \x1b[0m`);
                console.log(`\x1b[33m Note: All the logger functionality will be restricted to console \x1b[0m`);
            }
            else {
                console.log(`\x1b[32m\x1b[40m Connected to Queues \x1b[0m`);

            }
            console.log("\x1b[31m\n > Checking Storage Connections\x1b[0m",);
            if (!storageConnection) {
                console.log(`\x1b[31m Storage connection not available \x1b[0m`);
                console.log(`\x1b[31m Storage related functionalities will be unavailable \x1b[0m`);
                console.log(`\x1b[31m Please configure STORAGECONNECTION in .env for storage functions \x1b[0m`);

            }
            else {
                console.log(`\x1b[32m\x1b[40m\n Connected to Storage \x1b[0m`);
            }
            console.log("\x1b[31m\n > Checking Logger Queue \x1b[0m",);
            if (!loggerQueueName) {
                console.log(`\x1b[33m Logger queue is not configured. App will write to  \x1b[0m`);
                console.log(`\x1b[32m tdei-ms-log queue \x1b[0m`);
            } else {
                console.log(`\x1b[32m Logger configured \x1b[0m`);
            }
            console.log(`\x1b[32m ------------------------- \x1b[0m`);

            return true;
        }
        return true;
    }


}