import { IStorageConfig } from "../../../../models/abstracts/istorageconfig";
import { Provider } from "../../../../types/provider";

export class LocalStorageConfig implements IStorageConfig{
    provider: Provider = "Local";
    serverRoot: string =  process.env.STORAGECONNECTION || "";

    static default(): LocalStorageConfig {
        return new LocalStorageConfig();
    }
}