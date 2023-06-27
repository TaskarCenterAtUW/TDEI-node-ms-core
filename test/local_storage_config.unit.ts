/**
 * Unit testing for local storage config
 * 
 */

import { LocalStorageConfig } from "../src/core/storage/providers/local/local_storage_config"

describe('Local Storage config', () => {
    it('Should initialize with no configuration given', () => {
        // Act
        let config = new LocalStorageConfig();
        // Assert
        expect(config.provider).toBe('Local');
    })
    it('Should take the env connection', () => {
        // Arrange
        const connection = 'sample-connection';
        process.env.STORAGECONNECTION = connection;
        // Act
        let config = new LocalStorageConfig();
        // Assert
        expect(config.serverRoot).toBe(connection);
    })
    it('Should take values from default when default is called', () => {
        // Arrange
        const connection = 'sample-connection';
        process.env.STORAGECONNECTION = connection;
        // Act
        let config = LocalStorageConfig.default();
        // Assert
        expect(config.serverRoot).toBe(connection);

    })
})