import { BlobSASPermissions, BlobServiceClient, RestError } from "@azure/storage-blob";
import { IStorageConfig } from "../../../../models/abstracts/istorageconfig";
import { NotFoundResourceError } from "../../../../utils/resource-errors/not-found-resource-error";
import { UnprocessableResourceError } from "../../../../utils/resource-errors/unprocessable-resource-error";
import { FileEntity } from "../../abstract/file_entity";
import { StorageClient } from "../../abstract/storage_client";
import { AzureFileEntity } from "./azure_file_entity";
import { AzureStorageConfig } from "./azure_storage_config";
import { AzureStorageContainer } from "./azure_storage_container";

/**
 * Azure implementation of the Storage client
 */
export class AzureStorageClient implements StorageClient {

    connectionString: string;
    _blobServiceClient: BlobServiceClient;

    constructor(config: AzureStorageConfig) {
        this.connectionString = config.connectionString;
        this._blobServiceClient = BlobServiceClient.fromConnectionString(
            config.connectionString
        );
    }


    /**
     * Fetches the Storage container of certain name
     * @param name Name of the container
     * @returns an instance of AzureStorageContainer
     */
    getContainer(name: string): Promise<AzureStorageContainer> {

        return new Promise((resolve, reject) => {
            const containerClient = this._blobServiceClient.getContainerClient(name);
            resolve(new AzureStorageContainer(name, containerClient));
        });
    }

    /**
    * Get the container name and file path from the file URL
    * @param fileUrl URL of the file
    * @returns object with containerName and fileRelativePath
    */
    private getContainerInfo(fileUrl: string) {
        const url = new URL(fileUrl);
        const filePath = url.pathname;
        const fileComponents = filePath.split('/');
        const containerName = fileComponents[1];
        const fileRelativePath = decodeURI(fileComponents.slice(2).join('/'));
        return {
            containerName,
            fileRelativePath
        };
    }

    /**
     * Clones a file from one container to another
     * @param fileUrl file url. 
     * @param destinationContainerName Destination container name
     * @param destinationFilePath Destination file path, full path from container root. ex. /path/to/file.txt
     * @returns a promise of the file entity
     */
    cloneFile(fileUrl: string, destinationContainerName: string, destinationFilePath: string): Promise<FileEntity> {
        const { containerName: sourceContainerName, fileRelativePath: sourceFileName } = this.getContainerInfo(fileUrl);
        return new Promise(async (resolve, reject) => {
            const sourceContainerClient = this._blobServiceClient.getContainerClient(sourceContainerName);
            const destinationContainerClient = this._blobServiceClient.getContainerClient(destinationContainerName);
            const blobClient = sourceContainerClient.getBlockBlobClient(sourceFileName);

            const newBlobClient = destinationContainerClient.getBlockBlobClient(destinationFilePath);
            blobClient.getProperties().then((value) => {
                newBlobClient.beginCopyFromURL(blobClient.url).then((value: any) => {
                    resolve(new AzureFileEntity(destinationFilePath, newBlobClient, value.contentType));
                }).catch((error: any) => {
                    console.log(
                        `requestId - ${error.request.requestId}, statusCode - ${error.statusCode}, errorCode - ${error.details.errorCode}\n`
                    );
                    reject(new UnprocessableResourceError());
                });
            }).catch((error: any) => {
                console.log(
                    `requestId - ${error.request.requestId}, statusCode - ${error.statusCode}, errorCode - ${error.details.errorCode}\n`
                );
                if (error.statusCode === 404) {
                    const nfe = new NotFoundResourceError(error.details.errorCode);
                    nfe.body.code = error.details.errorCode;
                    reject(nfe);

                }
                else {
                    reject(new UnprocessableResourceError());
                }
            });
        });
    }

    getFile(containerName: string, fileName: string): Promise<FileEntity> {
        return new Promise((resolve, reject) => {
            const containerClient = this._blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlockBlobClient(decodeURI(fileName));
            blobClient.getProperties().then((value) => {
                resolve(new AzureFileEntity(fileName, blobClient, value.contentType));
            }).catch((error: any) => {
                // Have to convert somehow.
                console.log(
                    `requestId - ${error.request.requestId}, statusCode - ${error.statusCode}, errorCode - ${error.details.errorCode}\n`
                );
                if (error.statusCode === 404) {
                    // reject(new NotFoundResourceError());
                    const nfe = new NotFoundResourceError(error.details.errorCode);
                    nfe.body.code = error.details.errorCode;
                    reject(nfe);

                }
                else {
                    reject(new UnprocessableResourceError());
                }
            });
        });
    }

    getFileFromUrl(fullUrl: string): Promise<FileEntity> {
        // Check the URL for things we need.
        const url = new URL(fullUrl);
        console.log(url);
        const filePath = url.pathname;
        const fileComponents = filePath.split('/');
        const containerName = fileComponents[1];
        const fileRelativePath = decodeURI(fileComponents.slice(2).join('/'));
        return this.getFile(containerName, fileRelativePath);
    }

    getSASUrl(containerName: string, filePath: string, expiryInHours: number): Promise<string> {
        return new Promise((resolve, reject) => {
            // const permissions = BlobSASPermissions.from({read:true})
            const containerClient = this._blobServiceClient.getContainerClient(containerName);
            const blobClient = containerClient.getBlockBlobClient(filePath);
            const sasToken = blobClient.generateSasUrl({
                permissions: BlobSASPermissions.parse("r"),
                expiresOn: new Date(new Date().valueOf() + 3600 * 1000 * expiryInHours)
            });
            resolve(sasToken);
        });
    }

}