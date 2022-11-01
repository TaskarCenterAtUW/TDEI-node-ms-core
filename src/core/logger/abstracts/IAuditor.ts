import { QueueMessage } from "../../queue";
import { AuditEvent } from "../model/audit_event";
import { AuditRequest } from "../model/audit_request";

export interface IAuditor {

    addRequest(request:AuditRequest): QueueMessage;

    updateRequest(request: AuditRequest): QueueMessage;

    addEvent(event: AuditEvent): QueueMessage;
}