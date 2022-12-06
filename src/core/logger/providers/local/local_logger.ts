
import fetch from "node-fetch";
import { QueueMessage } from "../../../queue";
import { IAnalytics } from "../../abstracts/IAnalytics";
import { IAuditor } from "../../abstracts/IAuditor";
import { ILoggable } from "../../abstracts/ILoggable";

export class LocalLogger implements ILoggable {

    private logPath = '/log';


    recordMetric(name: string, value: number): void {
        // request(this.logPath,)
        fetch('http://localhost:8080/log',{
            method:'post',
            body:JSON.stringify({'name':name,'value':value,'type':'metric'})
        });
        
    }
    sendAll(): void {
       console.log('Ignoring sendAll for Local implementation');
    }
    recordRequest(req: any, res: any): void {
        fetch('http://localhost:8080/log',{
            method:'post',
            body:JSON.stringify({'req':req,'res':res,'type':'request'})
        });
    }
    info(message?: any, ...optionalParams: any[]): void {
        fetch('http://localhost:8080/log',{
            method:'post',
            body:JSON.stringify({'message':message,'other':optionalParams,'type':'info'})
        });
    }
    debug(message?: any, ...optionalParams: any[]): void {
        fetch('http://localhost:8080/log',{
            method:'post',
            body:JSON.stringify({'message':message,'other':optionalParams,'type':'debug'})
        });
    }
    recordMessage(message: QueueMessage): void {
        fetch('http://localhost:8080/log',{
            method:'post',
            body:JSON.stringify({'message':message.toJSON,'type':'queueMessage'})
        });
    }
    getAuditor(): IAuditor | null {
        throw new Error("Method not implemented.");
    }
    getAnalytic(): IAnalytics | null {
        throw new Error("Method not implemented.");
    }

}