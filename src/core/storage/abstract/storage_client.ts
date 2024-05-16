import { FileEntity } from "./file_entity";
import { StorageContainer } from "./storage_container";

/**
 * Abstract class for Storage Client
 */
export abstract class StorageClient {
    /**
     * Fetches the container
     * @param name Name of the container
     */
    abstract getContainer(name:string): Promise<StorageContainer>;


    abstract getFile(containerName:string, fileName:string): Promise<FileEntity>;


    abstract getFileFromUrl(fullUrl:string): Promise<FileEntity>;

    abstract getSASUrl(containerName:string, filePath:string, expiryInHours:number): Promise<string>;
 }