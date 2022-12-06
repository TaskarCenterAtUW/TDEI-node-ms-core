import { FileEntity } from "../../abstract/file_entity";
import { StorageClient } from "../../abstract/storage_client";
import { StorageContainer } from "../../abstract/storage_container";

export class LocalStorageClient implements StorageClient{
    
    getContainer(name: string): Promise<StorageContainer> {
        throw new Error("Method not implemented.");
    }
    getFile(containerName: string, fileName: string): Promise<FileEntity> {
        throw new Error("Method not implemented.");
    }
    getFileFromUrl(fullUrl: string): Promise<FileEntity> {
        throw new Error("Method not implemented.");
    }

}