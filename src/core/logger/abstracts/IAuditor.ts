import { AuditEvent } from "../model/audit_event";
import { AuditRequest } from "../model/audit_request";

export interface IAuditor {

    addRequest(request:AuditRequest);

    updateRequest(request: AuditRequest);

    addEvent(event: AuditEvent);
}