/**
 * Unit testing for `local_file_entity.ts`
 * Depends on axios framework and get call
 */

import { Readable } from "stream";
import { LocalFileEntity } from "../src/core/storage/providers/local/local_file_entity"

const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock('axios', ()=>{
    return {
        get: jest.fn().mockImplementation(()=>{
            const mockedStream = Readable.from('random-data', {encoding: 'utf8'})

            mockGet();
            return {data:mockedStream};
        }),
        post:jest.fn().mockImplementation(()=>{
            mockPost();
            return 
        })
    }
})

describe('Local file entity', ()=>{
    it('Should get the file appropriately', ()=>{
        const file = new LocalFileEntity('sample.zip','http://localhost:3000','application/zip');
        expect(file).toBeTruthy();
        expect(file.fileName).toBe('sample.zip');
    })
    it('Should get the file from axios', async ()=>{
        const file = new LocalFileEntity('sample.zip','http://localhost:3000','application/zip');
        const fileStream = await file.getStream();
        expect(mockGet).toHaveBeenCalledTimes(1);
    })
    it('Should get the data text', async () =>{
        mockGet.mockClear();
        const file = new LocalFileEntity('sample.zip','http://localhost:3000','application/zip');
        const fileText = await file.getBodyText();
        expect(fileText).toBe('random-data');
        expect(mockGet).toHaveBeenCalledTimes(1);
    })
    it('Should upload from data', async ()=>{
        const file = new LocalFileEntity('sample.zip','http://localhost:3000','application/zip');
        const dummyStream =  Readable.from([],{encoding:'binary'}); 
        const uploadedEntity = await file.upload(dummyStream);
        expect(mockPost).toHaveBeenCalledTimes(1);
        expect(uploadedEntity).toBe(file);

    })
})