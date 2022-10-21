import { Core } from "../../../core";
import { Queue, QueueMessage } from "../../queue";
import { IAuditor } from "../abstracts/IAuditor";
import { AuditEvent } from "../model/audit_event";
import { AuditRequest } from "../model/audit_request";

export class AzureAuditor implements IAuditor {

    private logQueue: Queue;
    addRequest(request: AuditRequest) {
        this.logQueue.add(QueueMessage.from(
            {
                messageType:'addRequest',
                message:request.toString(),
            }
        ));
    }
    updateRequest(request: AuditRequest) {
         this.logQueue.add(QueueMessage.from(
            {
                messageType:'updateRequest',
                message:request.toString()
            }
         ))
    }
    addEvent(event: AuditEvent) {
        this.logQueue.add(
            QueueMessage.from(
                {
                    messageType:'addEvent',
                    message:event.toString()
                }
            )
        )
    }

    constructor(queueName: string){
        this.logQueue = Core.getQueue(queueName);
    }

}