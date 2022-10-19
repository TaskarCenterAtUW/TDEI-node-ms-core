import { IAuditor } from "../abstracts/IAuditor";
import { AuditEvent } from "../model/audit_event";
import { AuditRequest } from "../model/audit_request";

export class AzureAuditor implements IAuditor {

    addRequest(request: AuditRequest) {
        throw new Error("Method not implemented.");
    }
    updateRequest(request: AuditRequest) {
        throw new Error("Method not implemented.");
    }
    addEvent(event: AuditEvent) {
        throw new Error("Method not implemented.");
    }

}