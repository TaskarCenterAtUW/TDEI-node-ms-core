import { CloudConfig, Config } from "../../lib/models/config";

describe('Configuration',()=>{

    let configuration = Config.from({
        provider:'Azure', // default
        cloudConfig:{
            connectionString:{
                appInsights:"AppInsightsConnectionString",
                blobStorage:"BlobStorageConnectionString",
                serviceBus:"ServiceBusConnectionString",
            },
            logQueue:"logQueueName"

        }
    });

    it('Should have configuration',()=>{
        expect(configuration.cloudConfig).toBeInstanceOf(CloudConfig);
    });
    it('Should have cloud Config',()=>{
        expect(configuration.cloudConfig.connectionString.appInsights).toBe("AppInsightsConnectionString");
        expect(configuration.cloudConfig.connectionString.blobStorage).toBe("BlobStorageConnectionString");
        expect(configuration.cloudConfig.connectionString.serviceBus).toBe("ServiceBusConnectionString");
    })
    it('Should instantiate', () => {
        let newConfig = Config.from();
        expect(newConfig).toBeInstanceOf(Config);
    });

})