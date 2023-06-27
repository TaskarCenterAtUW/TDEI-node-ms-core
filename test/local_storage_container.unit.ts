import { FileEntity } from "../src/core/storage";
import { LocalFileEntity } from "../src/core/storage/providers/local/local_file_entity";
import { LocalStorageContainer } from "../src/core/storage/providers/local/local_storage_container"

/**
 * Unit test for `local_storage_container.ts`
 * Depends on axios get call
 */
const mockGet = jest.fn();
jest.mock('axios', () => {
    return {
        get: jest.fn().mockImplementation(() => {
            mockGet();
            return Promise.resolve({
                data: [{ name: 'sample1', path: '/sample/path1.zip' },
                { name: 'sample2', path: '/sample/path2.zip' },
                { name: 'sample3', path: '/sample/path3.zip' }]
            });
        })
    }
})
describe('Local storage container', () => {
    
    const host = 'http://localhost:3000';
    const containerName = 'sample';

    it('Should be able to create with server root and name', () => {
        // Act
        const localContainer = new LocalStorageContainer(containerName, host);
        // Assert
        expect(localContainer).toBeTruthy();
    })
    it('Should get list of files as given by server', async () => {
        // Arrange
        const localContainer = new LocalStorageContainer(containerName, host);
        // Act
        const files = await localContainer.listFiles();
        // Assert
        expect(files.length).toBe(3);
        files.forEach((element) => {
            expect(element).toBeInstanceOf(LocalFileEntity);
        })

    })
    it('Should create a new file based on path', () => {
        // Arrange
        const localContainer = new LocalStorageContainer(containerName, host);
        // Act
        const newFile = localContainer.createFile('abc.zip', 'application/zip');
        // Assert
        expect(newFile).toBeTruthy()
        expect(newFile.fileName).toBe('abc.zip');
    })
})