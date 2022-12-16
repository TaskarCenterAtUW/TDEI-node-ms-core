import { IQueueConfig } from "../../../../models/abstracts/iqueueconfig";
import { Provider } from "../../../../types/provider";

export class LocalQueueConfig implements IQueueConfig{
    
    provider: Provider = "Local";

}