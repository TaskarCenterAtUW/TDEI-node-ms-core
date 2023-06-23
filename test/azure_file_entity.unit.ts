/**
 * Unit test cases for `azure_file_entity.ts`
 * This is dependent on BlockBlobClient object which is from @azure/storage-blob
 * That has to be mocked for now.
 */

import { BlobDownloadOptions, BlobDownloadResponseParsed, BlockBlobClient } from "@azure/storage-blob"
import { AzureFileEntity } from "../src/core/storage/providers/azure/azure_file_entity"
import { Readable } from "stream"

jest.mock('@azure/storage-blob', ()=>{
    return {
        BlockBlobClient : jest.fn().mockImplementation(()=>{
            return {
            download:(offset?: number, count?: number, options?: BlobDownloadOptions): Promise<{readableStreamBody:Readable}> => {
                const mockedStream = new Readable();
                mockedStream._read = function () { /* do nothing */ };
                return Promise.resolve({
                    readableStreamBody: mockedStream
                })
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
})