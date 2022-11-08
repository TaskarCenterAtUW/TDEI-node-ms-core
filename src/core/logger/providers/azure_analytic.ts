import { Core } from "../../../core";
import { Queue, QueueMessage } from "../../queue";
import { IAnalytics } from "../abstracts/IAnalytics";

export class AzureAnalytic implements IAnalytics {

    private analyticQueue: Queue;
    constructor(queueName: string){
        this.analyticQueue = Core.getQueue(queueName);
    }

    record(message: any) {
        this.analyticQueue.add(QueueMessage.from(
            {
                messageType:'analytic',
                message:message
            }
        ));
        this.analyticQueue.send();
    }

}