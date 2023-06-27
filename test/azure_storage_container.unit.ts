/**
 * Unit tests for Azure storage container at `azure_storage_container.ts`
 * The class implementation is based out of ContainerClient from @azure/storage
 * Methods to be mocked in ContainerClient
 * - listBlobsFlat
 * - getBlockBlobClient
 */

import { BlobItem, ContainerClient } from "@azure/storage-blob"
import { AzureStorageContainer } from "../src/core/storage/providers/azure/azure_storage_container"
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { MockedIterator, getMockFiles } from "./azure.mock";
import { AzureFileEntity } from "../src/core/storage/providers/azure/azure_file_entity";

jest.mock('@azure/storage-blob', () => {
    return {
        ContainerClient: jest.fn().mockImplementation(() => {
            return {
                listBlobsFlat: (): any => {
                    return new MockedIterator(getMockFiles())
                },
                getBlockBlobClient: jest.fn()
            }
        })
    }

})

describe('Azure Storage container', () => {

    it('Should be able to initialize from ContainerClient', () => {
        const azureContainer = new AzureStorageContainer('', new ContainerClient(''))
        expect(azureContainer).toBeTruthy();

    })
    it('Should be able to list files based on response from azure', async () => {

        const azureContainer = new AzureStorageContainer('', new ContainerClient(''))
        const files = await azureContainer.listFiles();
        expect(files.length).toBe(2)

    })
    it('Should be able to create a file with given name', () => {
        const azureContainer = new AzureStorageContainer('', new ContainerClient(''))
        const newFile = azureContainer.createFile('sample');
        expect(newFile).toBeTruthy();
        expect(newFile).toBeInstanceOf(AzureFileEntity);
        expect(newFile.fileName).toBe('sample');
    })
})