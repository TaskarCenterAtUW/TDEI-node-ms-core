
import axios from "axios";
import { QueueMessage } from "../../../queue";
import { IAnalytics } from "../../abstracts/IAnalytics";
import { IAuditor } from "../../abstracts/IAuditor";
import { ILoggable } from "../../abstracts/ILoggable";
import { AuditEvent } from "../../model/audit_event";
import { AuditRequest } from "../../model/audit_request";

export class LocalLogger implements ILoggable, IAuditor {


    addRequest(request: AuditRequest): QueueMessage {
        const message = QueueMessage.from(
            {
                messageType:'addRequest',
                data:request
            }
        );
        this.sendLog(JSON.stringify(message.toJSON()));

        return message;
    }


    updateRequest(request: AuditRequest): QueueMessage {
        const message = QueueMessage.from(
            {
                messageType:'updateRequest',
                data:request
            }
         );
         this.sendLog(JSON.stringify(message.toJSON()));

         return message;
    }


    addEvent(event: AuditEvent): QueueMessage {
        const message =  QueueMessage.from(
            {
                messageType:'addEvent',
                data: event
            }
        );
        this.sendLog(JSON.stringify(message.toJSON()));
        return message;
    }

    private logPath = '/log';


    recordMetric(name: string, value: number): void {

        this.sendLog(JSON.stringify({'name':name,'value':value,'type':'metric'}));

    }
    sendAll(): void {
       console.log('Ignoring sendAll for Local implementation');
    }
    recordRequest(req: any, res: any): void {

        this.sendLog(JSON.stringify({'req':req,'res':res,'type':'request'}));
    }
    info(message?: any, ...optionalParams: any[]): void {

        this.sendLog(JSON.stringify({'message':message,'other':optionalParams,'type':'info'}));
    }
    debug(message?: any, ...optionalParams: any[]): void {

        this.sendLog(JSON.stringify({'message':message,'other':optionalParams,'type':'debug'}));
    }
    recordMessage(message: QueueMessage): void {

        this.sendLog(JSON.stringify({'message':message.toJSON,'type':'queueMessage'}));

    }
    getAuditor(): IAuditor | null {
        return this;
    }
    getAnalytic(): IAnalytics | null {
        throw new Error("Method not implemented.");
    }

    private sendLog(message:string) {
        // fetch('http://localhost:8080/log',{
        //     method:'post',
        //     body:message
        // });

        console.log(message);
        axios.post('http://localhost:8080/log',JSON.parse(message)).then((response)=>{
            console.log(response.data);
        console.log('Posted log');
        }).catch((e:Error)=>{
            console.log('Log posting failed ');
            console.log(e.message);
        });
    }

}