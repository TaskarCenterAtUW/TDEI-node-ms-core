import { AzureLoggerConfig } from "../src/core/logger/providers/azure_logger_config";

describe('Azure logger Config', () => {

    const configuration = AzureLoggerConfig.default();

    it('Should have provider as azure', () => {
        expect(configuration.provider).toEqual("Azure");
    });
    it('Should pickup queuename from local configuration', () => {
        process.env.LOGGERQUEUE = "sample queue";
        const localConfiguration = AzureLoggerConfig.default();
        expect(localConfiguration.loggerQueueName).toEqual("sample queue");
    });
    it('Should pickup queuename from parameter', () => {
        process.env.LOGGERQUEUE = "environment queue";
        const parameterConfiguration = new AzureLoggerConfig("param queue");
        expect(parameterConfiguration.loggerQueueName).toEqual("param queue");
    });

})