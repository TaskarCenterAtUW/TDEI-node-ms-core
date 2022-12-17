import { IQueueConfig } from "../../../../models/abstracts/iqueueconfig";
import { Provider } from "../../../../types/provider";

// This is not used yet.
export class LocalQueueConfig implements IQueueConfig{

    provider: Provider = "Local";
    connectionString: string = process.env.QUEUECONNECTION || "";

    static default() : LocalQueueConfig {
        return new LocalQueueConfig();
    }
}