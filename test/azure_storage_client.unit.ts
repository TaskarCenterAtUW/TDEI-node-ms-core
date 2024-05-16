import { BlobSASPermissions,BlobServiceClient, ContainerClient } from "@azure/storage-blob"
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
                        },
                        generateSasUrl: jest.fn().mockImplementation((permissions: BlobSASPermissions,expiry: Date) => {
                            return 'generated-url';
                        })
                    }
                })
            }
        }),
        BlobServiceClient: jest.fn().mockImplementation(() => {
            return {
                getContainerClient: (name: string): ContainerClient => {
                    return new ContainerClient('');
                },
                getProperties: jest.fn(),
            }
        }),
        // Mock BlobSASPermissions.parse method 
        

        BlobSASPermissions: jest.fn().mockImplementation(() => {
            return {
                
                parse: (rawString: string): BlobSASPermissions => {
                    return {
                        read: true,
                        write: false,
                        delete: false,
                        create: false,
                        deleteVersion: false,
                        add: false,
                        tag: false,
                        move: false,
                        execute: false,
                        setImmutabilityPolicy: false,
                        permanentDelete: false
                        // Add the other two properties here
                    };
                }
            }
        })

    }

})


describe('Azure Storage Client', () => {

    beforeAll(() => {
        const mockedConString = jest.fn().mockReturnValue(new BlobServiceClient(''));
        BlobServiceClient.fromConnectionString = mockedConString;
        // const mockedBlobSASPermissions = jest.fn().mockReturnValue({new BlobSASPermissions({read:true})});
        BlobSASPermissions.parse = jest.fn().mockReturnValue({read:true});
    })

    it('Should initialize Client', () => {
        // Arrange 
        let azureConfig = AzureStorageConfig.default();
        // Act
        const azureClient = new AzureStorageClient(azureConfig);
        // Assert
        expect(azureClient).toBeTruthy();

    })
    it('Should get Container with name', async () => {
        // Arrange
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        // Act
        const container = await azureClient.getContainer('sample');
        // Assert
        expect(container).toBeInstanceOf(AzureStorageContainer);

    })
    it('Should get file from the container name and entity', async () => {
        // Arrange
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        // Act
        const file = await azureClient.getFile('sample', 'sample.zip');
        // Assert
        expect(file).toBeInstanceOf(AzureFileEntity);

    })
    it('Should get file from URL', async () => {
        // Arrange
        let fileUrl = 'http://sample.com/storage/abc.zip';
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        // Act
        const file = await azureClient.getFileFromUrl(fileUrl);
        // Assert
        expect(file).toBeInstanceOf(AzureFileEntity);
    })

    it('Should get SAS URL', async () => {
        // Arrange
        let azureConfig = AzureStorageConfig.default();
        const azureClient = new AzureStorageClient(azureConfig);
        // Act
        const sasUrl = await azureClient.getSASUrl('sample', 'sample.zip', 1);
        // Assert
        expect(sasUrl).toBeTruthy();
        expect(sasUrl).toBe('generated-url');
    })
})