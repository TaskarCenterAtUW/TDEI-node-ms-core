import { BlobServiceClient } from "@azure/storage-blob";
import { IStorageConfig } from "../../../../models/abstracts/istorageconfig";
import { StorageClient } from "../../abstract/storage_client";
import { AzureStorageConfig } from "./azure_storage_config";
import { AzureStorageContainer } from "./azure_storage_container";

/**
 * Azure implementation of the Storage client
 */
export class AzureStorageClient implements StorageClient {

    connectionString: string;
    _blobServiceClient: BlobServiceClient;

    constructor(config:AzureStorageConfig) {
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

}