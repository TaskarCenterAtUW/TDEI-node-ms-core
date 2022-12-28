import { FileEntity } from "../../abstract/file_entity";
import { StorageClient } from "../../abstract/storage_client";
import { StorageContainer } from "../../abstract/storage_container";
import { LocalStorageContainer } from "./local_storage_container";

export class LocalStorageClient implements StorageClient {

    private serverRoot: string;

    constructor(serverRoot: string){
        this.serverRoot = serverRoot;
    }
    getContainer(name: string): Promise<StorageContainer> {
        return new Promise((resolve, reject) => {
            resolve(new LocalStorageContainer(name, this.serverRoot));
        });
    }
    getFile(containerName: string, fileName: string): Promise<FileEntity> {
        throw new Error("Method not implemented.");
    }
    getFileFromUrl(fullUrl: string): Promise<FileEntity> {
        throw new Error("Method not implemented.");
    }

}