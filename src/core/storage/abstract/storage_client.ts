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
    abstract getContainer(name: string): Promise<StorageContainer>;


    abstract getFile(containerName: string, fileName: string): Promise<FileEntity>;


    abstract getFileFromUrl(fullUrl: string): Promise<FileEntity>;

    abstract getSASUrl(containerName: string, filePath: string, expiryInHours: number): Promise<string>;    /**
     * Clones a file from one container to another
     * @param sourceContainerName Source container name. 
     * @param sourceFileName Source file name, full path from container root. ex. /path/to/file.txt
     * @param destinationContainerName Destination container name
     * @param destinationFileName Destination file name, full path from container root. ex. /path/to/file.txt
     * @returns a promise of the file entity
     */
    abstract cloneFile(sourceContainerName: string, sourceFileName: string, destinationContainerName: string, destinationFileName: string): Promise<FileEntity>;
}