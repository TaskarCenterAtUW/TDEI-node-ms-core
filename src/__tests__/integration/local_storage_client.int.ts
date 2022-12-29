import { FileEntity } from "../../core/storage";
import { LocalStorageClient } from "../../core/storage/providers/local/local_storage_client";
import { LocalStorageContainer } from "../../core/storage/providers/local/local_storage_container";
/**
 * Integration tests for Local Storage client
 */
describe('Local Storage client',()=>{

    const localStorageClient = new LocalStorageClient();
    it('should be able to get container',async ()=>{
        const container = await localStorageClient.getContainer('sample');
        expect(container).toBeInstanceOf(LocalStorageContainer)
    });

    it('should give file Entity for getFile', async ()=>{
        const fileEntity = localStorageClient.getFile('sample','abc.txt');
        expect(fileEntity).toBeInstanceOf(FileEntity);
    });
    it('should give file Entity for getFileFromUrl', async ()=>{
        const fileEntity = localStorageClient.getFileFromUrl('http://localhost:8080/abc/fr.txt');
        expect(fileEntity).toBeInstanceOf(FileEntity);
    });
})