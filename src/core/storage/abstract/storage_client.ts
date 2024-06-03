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
      /**
     * Clones a file from one container to another
     * @param fileUrl file url. 
     * @param destinationContainerName Destination container name
     * @param destinationFilePath Destination file path, full path from container root. ex. /path/to/file.txt
     * @returns a promise of the file entity
     */
    abstract cloneFile(fileUrl: string, destinationContainerName: string, destinationFilePath: string): Promise<FileEntity>
}