import { Core } from "../src/core";
import { HostedAuthorizer } from "../src/core/auth/provider/hosted/hosted_authorizer";
import { Logger } from "../src/core/logger";
import { LocalLogger } from "../src/core/logger/providers/local/local_logger";
import { AzureStorageClient } from "../src/core/storage/providers/azure/azure_storage_client";
import { AzureStorageConfig } from "../src/core/storage/providers/azure/azure_storage_config";
import { LocalStorageClient } from "../src/core/storage/providers/local/local_storage_client";
import { LocalStorageConfig } from "../src/core/storage/providers/local/local_storage_config";

jest.mock('../src/core/storage/providers/azure/azure_storage_client');
jest.mock('../src/core/storage/providers/local/local_storage_client');
jest.mock('../src/core/logger');
jest.mock('../src/core/logger/providers/local/local_logger');
jest.mock('../src/core/auth/provider/hosted/hosted_authorizer');

describe('Core unit tests', () => {

    it('Should initialize with default configuration', () => {
        // Act and Assert
        expect(Core.initialize()).toBeTruthy();
    });
    it('Should initialize with Local Configuration', () => {
        // Act and assert
        expect(Core.initialize({ provider: "Local" })).toBe(true);
    })
    it('Should get default storage client by default', () => {
        // Arrange
        Core.initialize();
        // Act
        const client = Core.getStorageClient();
        // Assert
        expect(client).toBeInstanceOf(AzureStorageClient);
    })
    it('Should get Local storage client for local configuration', () => {
        // Act
        const client = Core.getStorageClient({ provider: "Local" });
        // Assert
        expect(client).toBeInstanceOf(LocalStorageClient);
    })
    it('Should get Local storage client for local Configuration', () => {
        // Arrange
        const localStorageConfig = new LocalStorageConfig();
        localStorageConfig.serverRoot = 'sample';
        // Act
        const client = Core.getStorageClient(localStorageConfig);
        // Assert
        expect(client).toBeInstanceOf(LocalStorageClient);
    })
    it('Should get Azure storage client for azure config', () => {
        // Arrange
        const azureConfig = new AzureStorageConfig();
        azureConfig.connectionString = 'sample-string';
        // Act
        const client = Core.getStorageClient(azureConfig);
        // Assert
        expect(client).toBeInstanceOf(AzureStorageClient);
    })
    it('Should return Local storage client if core initialized by local and default storage requested', () => {
        // Arrange
        Core.initialize({ provider: 'Local' });
        // Act
        const client = Core.getStorageClient();
        // Assert
        expect(client).toBeInstanceOf(LocalStorageClient);
    })
    // Logger configurations
    it('Should get Azure logger by default', () => {
        // Arrange
        Core.initialize();
        // Act
        const logger = Core.getLogger();
        // Assert
        expect(logger).toBeInstanceOf(Logger)
    })
    it('Should return local logger for local', () => {
        // Arrange
        Core.initialize({ provider: "Local" });
        // Act
        const logger = Core.getLogger();
        // Assert
        expect(logger).toBeInstanceOf(LocalLogger);
    })

    // Authorizer
    it('Should return Hosted Authorizer if provider not given', () => {
        // Act
        const authorizer = Core.getAuthorizer({});
        // Assert
        expect(authorizer).toBeInstanceOf(HostedAuthorizer);
    })

});