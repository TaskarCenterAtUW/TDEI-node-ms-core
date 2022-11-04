import { IQueueConfig } from "../../../models/abstracts/iqueueconfig";
import { Provider } from "../../../types/provider";

export class AzureQueueConfig implements IQueueConfig{
    provider: Provider = "Azure";
    connectionString: string = process.env.QUEUECONNECTION || "";

    static default() : AzureQueueConfig {
        return new AzureQueueConfig();
    }

}