import { ILoggable } from "../abstracts/ILoggable";
import * as appInsights from 'applicationinsights';
import { Config } from "../../../models/config";

const appInsightConnectionString =  "InstrumentationKey=f98ba6d5-58e1-4267-827e-ccac68caf50f;IngestionEndpoint=https://westus2-2.in.applicationinsights.azure.com/;LiveEndpoint=https://westus2.livediagnostics.monitor.azure.com/";

export class AppInsightsProvider implements ILoggable
{
    private client: appInsights.TelemetryClient;
    
    constructor(config : Config)
    {
        appInsights.setup(config.azure.connectionString.appInsights)
        .setAutoCollectConsole(true, true)
        .start();
       this.client = appInsights.defaultClient;
    }
    

    recordMetric(name: string, value: number) {
        this.client.trackMetric({ name: name, value: value });
    }

    recordRequest(req:any,res:any){
        this.client.trackNodeHttpRequest({request:req,response:res});
    }

    sendAll() {
        // Basically flushes all the logs
        this.client.flush();
    }
    
}