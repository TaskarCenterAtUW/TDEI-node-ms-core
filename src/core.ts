import os from 'os';
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
import { LocalStorageClient } from "./core/storage/providers/local/local_storage_client";
import { LocalLogger } from "./core/logger/providers/local/local_logger";
import { LocalStorageConfig } from "./core/storage/providers/local/local_storage_config";
import { IAuthorizer } from "./core/auth/abstracts/IAuthorizer";
import { HostedAuthorizer } from "./core/auth/provider/hosted/hosted_authorizer";
import { IAuthConfig } from "./core/auth/abstracts/IAuthConfig";
import { AuthConfig } from "./core/auth/model/auth_config";
import { SimulatedAuthorizer } from "./core/auth/provider/simulated/simulated_authorizer";
import { Provider, ServiceProvider } from "./types/provider";
// import { LocalLogger } from "./core/logger/providers/local/local_logger";
// import { LocalStorageClient } from "./core/storage/providers/local/local_storage_client";

export class Core {
    private static logger: ILoggable | undefined;
    private static config: IConfig;
    private static LOCAL_PROVIDER: Provider = 'Local';
    private static AZURE_PROVIDER: Provider = 'Azure';
    private static HOSTED_AUTH_PROVIDER: ServiceProvider = 'Hosted';
    private static SIMULATED_AUTH_PROVIDER: ServiceProvider = 'Simulated';

    static getLogger(): ILoggable {
        if (this.logger !== undefined)
            return this.logger;
        else {
            if (this.config.provider === this.AZURE_PROVIDER) {
                this.logger = new Logger(new AzureLoggerConfig());
                return this.logger;
            }
            else if(this.config.provider === this.LOCAL_PROVIDER) {
                this.logger = new LocalLogger();
                return this.logger;
            }
            else {
                throw new Error("Configuration not initialized");
            }
        }

    }



    static initialize(config: IConfig = CoreConfig.default()): boolean {
        this.logger = undefined;
        switch (config.provider) {
            case 'Azure':
                this.config = config;
                // this.logger = new Logger(config);
                break;
            case 'Local':
                this.config = config;
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


    static getTopic( topicName: string, qconfig: IQueueConfig | null = null, maxConcurrentMessages: number = os.cpus().length): Topic {
        if (qconfig == null) {
            return new Topic(this.config, topicName, maxConcurrentMessages);
        }
        else {
            return new Topic(qconfig, topicName, maxConcurrentMessages);
        }
    }

    static getStorageClient(config: IStorageConfig | null = null): StorageClient | null {
        if (config == null) {
            // figure out the configuration based on
            // Default configuration
            if (this.config.provider === this.AZURE_PROVIDER) {
                // Figure out and send the azure storage client
                return new AzureStorageClient(AzureStorageConfig.default());

            }
            else if(this.config.provider === this.LOCAL_PROVIDER){
                return new LocalStorageClient(LocalStorageConfig.default().serverRoot);
            }
            else {
                console.error('Storage not configured for ' + this.config.provider);
                return null;
            }
        }
        else {
            if (config.provider === this.AZURE_PROVIDER) {
                if (config instanceof AzureStorageConfig) {
                    return new AzureStorageClient(config);
                }
                else if(this.config.provider === this.LOCAL_PROVIDER){
                    return new LocalStorageClient(LocalStorageConfig.default().serverRoot);
                }
                else {
                    console.debug("Provided configuration is mismatched");
                    console.debug(config);
                    return null;
                }
            } else if(config.provider === this.LOCAL_PROVIDER){
                if(config instanceof LocalStorageConfig){
                    return new LocalStorageClient(config.serverRoot);
                } else {
                return new LocalStorageClient(LocalStorageConfig.default().serverRoot);
                }
            }
            else {
                console.error("No implementation for type " + config.provider);
                return null;
            }
        }
    }
    /**
     *
     * @param config instance of `IAuthConfig` or partial. If provider is "Hosted", should have apiUrl
     *             Eg. `getAuthorizer({provider:"Hosted",apiUrl:"<apiURL>"})`
     *                  `getAuthorizer({provider:"Simulated"})`
     * @returns Instance of `IAuthorizer` that has `hasPermission()` method
     */
    static getAuthorizer(config: Partial<IAuthConfig> ): IAuthorizer | null {

        if(config.provider == null){
            // Pick the hosted one with env
            return new HostedAuthorizer(AuthConfig.default());
        }

            // Get based on the authconfig
            if(config.provider === this.HOSTED_AUTH_PROVIDER){
                if(!config.apiUrl){
                return new HostedAuthorizer(AuthConfig.default());
                }
                else {
                    return new HostedAuthorizer({provider:config.provider,apiUrl:config.apiUrl!});
                }
            }
            else if(config.provider === this.SIMULATED_AUTH_PROVIDER){
                return new SimulatedAuthorizer(config);
            }
            return null;

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


        if (this.config.provider === this.AZURE_PROVIDER) {
            // check for the following process variables
            const loggerQueueName = process.env.LOGGERQUEUE;
            const queueConnection = process.env.QUEUECONNECTION;
            const storageConnection = process.env.STORAGECONNECTION;
            // \\x1b[30m $1 \\x1b[0m
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