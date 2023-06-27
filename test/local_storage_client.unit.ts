/**
 * Unit testing for Localstorage client `local_storage_client.ts`
 * This just has to simulate list of files get call
 */

import { LocalStorageClient } from "../src/core/storage/providers/local/local_storage_client";
import { NotFoundResourceError } from "../src/utils/resource-errors/not-found-resource-error";

// const mockGet = jest.fn();
jest.mock('axios', () => {
    return {
        get: jest.fn().mockImplementation(() => {
            // mockGet();
            return Promise.resolve({
                data: [{ name: 'sample1', path: '/sample/path1.zip' },
                { name: 'sample2', path: '/sample/path2.zip' },
                { name: 'sample3', path: '/sample/path3.zip' }]
            });
        })
    }
})

jest.mock('../src/core/storage/providers/local/local_storage_container', () => {
    return {
        LocalStorageContainer: jest.fn().mockImplementation(() => {
            return {
                listFiles: jest.fn().mockImplementation(() => {
                    return Promise.resolve([
                        { fileName: 'sample1', filePath: 'sample/path1.zip' },
                        { fileName: 'sample2', filePath: 'sample/path2.zip' },
                        { fileName: 'sample3', filePath: 'sample/path3.zip' }
                    ])
                })
            }
        })
    }
})

describe('Local storage client', () => {
    const host = 'http://localhost:3000';

    it('Should initialize Client appropriately', () => {
        // Act
        const localClient = new LocalStorageClient(host);
        // Assert
        expect(localClient).toBeTruthy();
    })
    it('Should return the container', async () => {
        // Arrange
        const localClient = new LocalStorageClient(host);
        // Act
        const container = await localClient.getContainer('sample');
        // Assert
        expect(container).toBeTruthy();
    })
    it('Should get file from container', async () => {
        // Arrange
        const localClient = new LocalStorageClient(host);
        // Act
        const file = await localClient.getFile('sample', 'path1.zip');
        // Assert
        expect(file).toBeTruthy();
    })
    it('Should get the file from the URL', async () => {
        // Arrange
        const localClient = new LocalStorageClient(host);
        const fileUrl = 'http://localhost:3000/sample/path1.zip';
        // Act
        const file = await localClient.getFileFromUrl(fileUrl);
        // Assert
        expect(file).toBeTruthy();

    })
    it('Should throw a Not found error when not found', async () => {
        // Arrange
        const localClient = new LocalStorageClient(host);
        // Act and Assert
        await expect(localClient.getFile('sample', 'nofile.zip')).rejects.toThrow(new NotFoundResourceError('404'));
    })
})