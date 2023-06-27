import { BlobServiceClient, ContainerClient } from "@azure/storage-blob"
import { AzureStorageContainer } from "../src/core/storage/providers/azure/azure_storage_container"
import { MockedIterator, getMockFiles } from "./azure.mock"
import { AzureStorageClient } from "../src/core/storage/providers/azure/azure_storage_client"
import { AzureStorageConfig } from "../src/core/storage/providers/azure/azure_storage_config"
import { AzureFileEntity } from "../src/core/storage/providers/azure/azure_file_entity"

/**
 * Unit test for `azure_storage_client.ts`
 * Depends on BlobServiceClient and ContainerClient of `@azure/storage` 
 */
jest.mock('@azure/storage-blob', () => {
    return {
        ContainerClient: jest.fn().mockImplementation(() => {
            return {
                listBlobsFlat: (): any => {
                    return new MockedIterator(getMockFiles())
                },
                getBlockBlobClient: jest.fn().mockImplementation(() => {
                    return {
                        getProperties: (): Promise<{ contentType: string }> => {
                            return Promise.resolve({
                                contentType: ''
                            });
                        }
                    }
                })
            }
        }),
        BlobServiceClient: jest.fn().mockImplementation(() => {
            return {
                getContainerClient: (name: string): ContainerClient => {
                    return new ContainerClient('');
                },
                getProperties: jest.fn()
            }
        }),

    }

})


describe('Azure Storage Client', () => {

    beforeAll(() => {
        const mockedConString = jest.fn().mockReturnValue(new BlobServiceClient(''));
        BlobServiceClient.fromConnectionString = mockedConString;
    })

    it('Should initialize Client', () => {
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        expect(azureClient).toBeTruthy();

    })
    it('Should get Container with name', async () => {
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        const container = await azureClient.getContainer('sample');
        expect(container).toBeInstanceOf(AzureStorageContainer);

    })
    it('Should get file from the container name and entity', async () => {
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        const file = await azureClient.getFile('sample', 'sample.zip');
        expect(file).toBeInstanceOf(AzureFileEntity);

    })
    it('Should get file from URL', async () => {
        let fileUrl = 'http://sample.com/storage/abc.zip';
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        const file = await azureClient.getFileFromUrl(fileUrl);
        expect(file).toBeInstanceOf(AzureFileEntity);
    })
})