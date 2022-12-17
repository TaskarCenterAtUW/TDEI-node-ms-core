import { Core } from "../../../core";
import { Queue, QueueMessage } from "../../queue";
import { IAuditor } from "../abstracts/IAuditor";
import { AuditEvent } from "../model/audit_event";
import { AuditRequest } from "../model/audit_request";

export class AzureAuditor implements IAuditor {

    private logQueue: Queue | null;

    addRequest(request: AuditRequest) :QueueMessage {
        const message = QueueMessage.from(
            {
                messageType:'addRequest',
                data:request
            }
        );
        this.logQueue?.add(message);

        return message;
    }

    updateRequest(request: AuditRequest) :QueueMessage {

        const message = QueueMessage.from(
            {
                messageType:'updateRequest',
                data:request
            }
         );
         this.logQueue?.add(message);
         return message;
    }
    addEvent(event: AuditEvent) :QueueMessage {
        const message =  QueueMessage.from(
            {
                messageType:'addEvent',
                data: event
            }
        );
        this.logQueue?.add(
           message
        );
        return message;
    }

    constructor(queueName: string){
        if(queueName === "") {
            console.error("Empty queue name for auditor");
            this.logQueue = null;
            return;
        }
        this.logQueue = Core.getQueue(queueName);
        this.logQueue.enableAutoSend(5);

    }

}