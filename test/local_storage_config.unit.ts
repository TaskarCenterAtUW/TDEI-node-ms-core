/**
 * Unit testing for local storage config
 * 
 */

import { LocalStorageConfig } from "../src/core/storage/providers/local/local_storage_config"

describe('Local Storage config', ()=>{
    it('Should initialize with no configuration given', ()=>{
        let config = new LocalStorageConfig();
        expect(config.provider).toBe('Local');
    })
    it('Should take the env connection', ()=>{
        const connection = 'sample-connection';
        process.env.STORAGECONNECTION = connection;
        let config = new LocalStorageConfig();
        expect(config.serverRoot).toBe(connection);
    })
    it('Should take values from default when default is called', ()=>{

        const connection = 'sample-connection';
        process.env.STORAGECONNECTION = connection;
        let config = LocalStorageConfig.default();
        expect(config.serverRoot).toBe(connection);

    })
})