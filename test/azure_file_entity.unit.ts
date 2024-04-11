/**
 * Unit test cases for `azure_file_entity.ts`
 * This is dependent on BlockBlobClient object which is from @azure/storage-blob
 * That has to be mocked for now.
 */

import { BlobDownloadOptions, BlobDownloadToBufferOptions, BlobUploadCommonResponse, BlockBlobClient, BlockBlobParallelUploadOptions } from "@azure/storage-blob"
import { AzureFileEntity } from "../src/core/storage/providers/azure/azure_file_entity"
import { Readable } from "stream"

const mockDownload = jest.fn();
const mockUpload = jest.fn();

jest.mock('@azure/storage-blob', () => {
    return {
        BlockBlobClient: jest.fn().mockImplementation(() => {
            return {
                download: (offset?: number, count?: number, options?: BlobDownloadOptions): Promise<{ readableStreamBody: Readable }> => {
                    const mockedStream = Readable.from('random-data', { encoding: 'utf8' })
                    // mockDownload();
                    return Promise.resolve({
                        readableStreamBody: mockedStream
                    })
                },
                downloadToBuffer: (offset?: number, count?: number, options?: BlobDownloadToBufferOptions): Promise<Buffer> => {
                    mockDownload();
                    return Promise.resolve(Buffer.from('random-data'));
                },

                uploadData: (data: Buffer | Blob | ArrayBuffer | ArrayBufferView, options?: BlockBlobParallelUploadOptions): Promise<BlobUploadCommonResponse> => {
                    return mockUpload();
                }
            }
        })
    }
})

describe('Azure file entity', () => {
    it('Should be able to initialize', () => {
        // Arrange
        const file = new AzureFileEntity('snfds', new BlockBlobClient(''));
        // Assert
        expect(file).toBeTruthy();
    })
    it('Should be able to download when the file stream is needed', async () => {
        // Arrange
        const file = new AzureFileEntity('snfds', new BlockBlobClient(''));
        // Act
        const stream = await file.getStream();
        // Assert
        expect(mockDownload).toHaveBeenCalledTimes(1);

    })

    it('Should be able to get the text', async () => {
        // Arrange
        mockDownload.mockClear();
        const file = new AzureFileEntity('snfds', new BlockBlobClient(''))
        // Act
        const body = await file.getBodyText();
        // Assert
        expect(body).toBe('random-data');
        expect(mockDownload).toHaveBeenCalledTimes(1);

    })
    it('Should be able to upload the content from readable stream', async () => {
        // Arrange
        const dummyStream = Readable.from([], { encoding: 'binary' }); // Blank stream
        const file = new AzureFileEntity('snfds', new BlockBlobClient(''))
        // Assert
        const uploadedEntity = await file.upload(dummyStream);
        // Act
        expect(mockUpload).toHaveBeenCalledTimes(1);
        expect(uploadedEntity).toBe(file);

    })

})