// Example file to create a file and upload it to the storage

import { Stream } from "stream";
import { Core } from "../../core";
import * as fs from 'fs';
import { AzureStorageConfig } from "../../core/storage/providers/azure/azure_storage_config";
import * as path from 'path';

async function exampleAzureTextContentUpload() {
    const storageClient = Core.getStorageClient(AzureStorageConfig.default())!;
    const container = await storageClient.getContainer('gtfspathways')!;
    
    // Code to create file based on content
    const file = await container.createFile('sample.txt','text/plain');
    const stream = Stream.Readable.from('Hello there');
    const newFile = await file.upload(stream);
    console.log(newFile.remoteUrl);
}

async function exampleAzureLocalFileUpload() {
    const storageClient = Core.getStorageClient(AzureStorageConfig.default())!;
    const container = await storageClient.getContainer('gtfspathways')!;
    // Get the read stream of local file
    const readStream = fs.createReadStream(path.join(__dirname, 'core.js'));
    const file = await container.createFile('core.js','application/javascript');
     
    const newFile = await file.upload(readStream);
    console.log(newFile.remoteUrl);
}