/**
 * Unit test for azure_storage_config.ts
 * 
 */

import { AzureStorageConfig } from "../src/core/storage/providers/azure/azure_storage_config"

describe('Azure storage config', ()=>{

    it('Should initialize with given parameters', ()=>{
        const azureStorageConfig = new AzureStorageConfig();
        expect(azureStorageConfig.provider).toBe('Azure');
        expect(azureStorageConfig.connectionString).toBe('');
    })
    it('Should get the value of connection string from process', ()=>{
        const storageConnection = 'dummy-storage-connection'
        process.env.STORAGECONNECTION = storageConnection;
        const azureStorageConfig = new AzureStorageConfig();
        expect(azureStorageConfig.connectionString).toBe(storageConnection);
    })
    it('Default should pick up from env', ()=>{
        const storageConnection = 'dummy-storage-connection'
        process.env.STORAGECONNECTION = storageConnection;
        const azureStorageConfig = AzureStorageConfig.default();
        expect(azureStorageConfig.connectionString).toBe(storageConnection);
    })
   
})