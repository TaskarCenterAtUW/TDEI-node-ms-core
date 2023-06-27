/**
 * Unit test for azure_storage_config.ts
 * 
 */

import { AzureStorageConfig } from "../src/core/storage/providers/azure/azure_storage_config"

describe('Azure storage config', () => {

    it('Should initialize with given parameters', () => {
        // Arrange and Act
        const azureStorageConfig = new AzureStorageConfig();
        // Assert
        expect(azureStorageConfig.provider).toBe('Azure');
        expect(azureStorageConfig.connectionString).toBe('');
    })
    it('Should get the value of connection string from process', () => {
        // Arrange
        const storageConnection = 'dummy-storage-connection'
        process.env.STORAGECONNECTION = storageConnection;
        // Act
        const azureStorageConfig = new AzureStorageConfig();
        // Assert
        expect(azureStorageConfig.connectionString).toBe(storageConnection);
    })
    it('Default should pick up from env', () => {
        // Arrange
        const storageConnection = 'dummy-storage-connection'
        process.env.STORAGECONNECTION = storageConnection;
        // Act
        const azureStorageConfig = AzureStorageConfig.default();
        // Assert
        expect(azureStorageConfig.connectionString).toBe(storageConnection);
    })

})