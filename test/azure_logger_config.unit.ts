import { AzureLoggerConfig } from "../src/core/logger/providers/azure_logger_config";

describe('Azure logger Config', () => {

    const configuration = AzureLoggerConfig.default();

    it('Should have provider as azure', () => {
        // Act and Assert
        expect(configuration.provider).toEqual("Azure");
    });

    it('Should pickup queuename from local configuration', () => {
        // Arrange
        process.env.LOGGERQUEUE = "sample queue";
        // Act
        const localConfiguration = AzureLoggerConfig.default();
        // Assert
        expect(localConfiguration.loggerQueueName).toEqual("sample queue");
    });

    it('Should pickup queuename from parameter', () => {
        // Arrange
        process.env.LOGGERQUEUE = "environment queue";
        // Act
        const parameterConfiguration = new AzureLoggerConfig("param queue");
        // Assert
        expect(parameterConfiguration.loggerQueueName).toEqual("param queue");
    });

})