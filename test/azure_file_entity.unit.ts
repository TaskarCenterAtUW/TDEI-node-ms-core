/**
 * Unit test cases for `azure_file_entity.ts`
 * This is dependent on BlockBlobClient object which is from @azure/storage-blob
 * That has to be mocked for now.
 */

import { BlobDownloadOptions, BlobDownloadResponseParsed, BlobUploadCommonResponse, BlockBlobClient, BlockBlobParallelUploadOptions } from "@azure/storage-blob"
import { AzureFileEntity } from "../src/core/storage/providers/azure/azure_file_entity"
import { Readable } from "stream"

const mockDownload = jest.fn();
const mockUpload = jest.fn();

jest.mock('@azure/storage-blob', ()=>{
    return {
        BlockBlobClient : jest.fn().mockImplementation(()=>{
            return {
            download:(offset?: number, count?: number, options?: BlobDownloadOptions): Promise<{readableStreamBody:Readable}> => {
                const mockedStream = Readable.from('random-data', {encoding: 'utf8'})
                // mockedStream._read = function () { /* do nothing */ };
                // mockedStream.push('random-data');
                mockDownload();
                return Promise.resolve({
                    readableStreamBody: mockedStream
                })
            },

            uploadData: (data: Buffer | Blob | ArrayBuffer | ArrayBufferView, options?: BlockBlobParallelUploadOptions):  Promise<BlobUploadCommonResponse> => {
                return mockUpload();
            }
        }
        })
    }
})

describe('Azure file entity', ()=>{
    it('Should be able to initialize', ()=>{
        const file = new AzureFileEntity('snfds',new BlockBlobClient(''))
        expect(file).toBeTruthy();
    })
    it('Should be able to download when the file stream is needed', async () =>{

        const file = new AzureFileEntity('snfds',new BlockBlobClient(''))
        const stream = await file.getStream();
        expect(mockDownload).toHaveBeenCalledTimes(1);

    })

    it('Should be able to get the text', async ()=>{
        mockDownload.mockClear();
        const file = new AzureFileEntity('snfds',new BlockBlobClient(''))
        const body = await file.getBodyText();
        console.log('Body is '+body);
        expect(body).toBe('random-data');
        expect(mockDownload).toHaveBeenCalledTimes(1);

    })
    it('Should be able to upload the content from readable stream', async ()=>{

        const dummyStream =  Readable.from([],{encoding:'binary'}); // Blank stream
       
        const file = new AzureFileEntity('snfds',new BlockBlobClient(''))
       const uploadedEntity = await file.upload(dummyStream);
       expect(mockUpload).toHaveBeenCalledTimes(1);
       expect(uploadedEntity).toBe(file);

    })
    
})