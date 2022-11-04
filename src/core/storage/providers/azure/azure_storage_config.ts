import { IStorageConfig } from "../../../../models/abstracts/istorageconfig";
import { Provider } from "../../../../types/provider";

export class AzureStorageConfig implements IStorageConfig{
    provider: Provider = "Azure";
    connectionString: string = process.env.STORAGECONNECTION || "";


    static default(): AzureStorageConfig {
        return new AzureStorageConfig();
    }

}