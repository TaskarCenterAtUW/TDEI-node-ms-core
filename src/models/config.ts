import { AzureQueueConfig } from "../core/queue/providers/azure-queue-config";
import { Provider } from "../types/provider";
import { IConfig } from "./abstracts/iconfig";


declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PROVIDER: Provider;
      }
    }
  }
  


export class CoreConfig implements IConfig {
    provider: Provider;

    static default(): CoreConfig {
        return new CoreConfig();
    }

    constructor(provider:Provider = process.env.PROVIDER || "Azure"){
        this.provider = provider;
    }

}

// class ConnectionString extends AbstractDomainEntity{

//     @Prop()
//     serviceBus!: string;
//     @Prop()
//     blobStorage!: string;
//     @Prop()
//     appInsights!: string;
// }

// export class CloudConfig extends AbstractDomainEntity {

//     @Prop()
//     @NestedModel(ConnectionString)
//     connectionString!: ConnectionString;

//     queueNames: string[] = [];
    
//     logQueue: string = 'tdei-ev-logger';
// }



// export class Config extends AbstractDomainEntity{
//     @Prop()
//     provider!: Provider;

//     @Prop()
//     @NestedModel(CloudConfig)
//     cloudConfig!: CloudConfig;

// }