import { ILoggable } from "../abstracts/ILoggable";
import * as appInsights from 'applicationinsights';
import { Config } from "../../../models/config";


export class AppInsightsProvider implements ILoggable
{
    private client: appInsights.TelemetryClient;
    
    constructor(config : Config)
    {
        appInsights.setup(config.cloudConfig.connectionString.appInsights)
        .setAutoCollectConsole(true, true)
        .start();
       this.client = appInsights.defaultClient;
    }
    

    recordMetric(name: string, value: number) {
        this.client.trackMetric({ name: name, value: value, namespace: process.env.npm_package_name });
    }

    recordRequest(req:any,res:any){
        this.client.trackNodeHttpRequest({request:req,response:res});
    }

    sendAll() {
        // Basically flushes all the logs
        this.client.flush();
    }
    
}