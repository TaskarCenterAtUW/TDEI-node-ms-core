// Azure file entity to be written.

import { BlockBlobClient } from "@azure/storage-blob";
import { FileEntity } from "../../abstract/file_entity";
import { Readable } from "stream";

/**
 * Azure implementation of FileEntity
 */
export class AzureFileEntity implements FileEntity {
    /**
     * Name of the file
     */
    fileName: string;

    /**
     * Type of the file.
     * Will be application/vnd if not provided.
     * Specify `text/plain` for txt files
     */
    mimeType: string;

    filePath: string;

    _blobClient: BlockBlobClient;

    remoteUrl: string;

    constructor(name: string, blobClient: BlockBlobClient, mimeType: string = 'text/plain') {
        this.filePath = name;
        this.fileName = name.replace(/^.*[\\\/]/, ''); // Get the last name;
        this.mimeType = mimeType;
        this._blobClient = blobClient;
        this.remoteUrl = this._blobClient.url;
    }
    /**
     * Fetches the readable stream of the file for reading the content
     * @returns ReadableStream that can be used to get the content
     */
    async getStream(): Promise<NodeJS.ReadableStream> {
        const downloadResponse = await this._blobClient.download(0);
        return Promise.resolve(downloadResponse.readableStreamBody!); // Not sure.
    }

    /**
     * Reads the file as text and returns the string
     * @returns string content of the file
     */
    async getBodyText(): Promise<string> {
        const stream = await this.getStream();
        return Promise.resolve(this.streamToText(stream));
    }

    /**
     * Uploads the content of the file
     * @param body Readable stream for the file
     * @returns the same object
     */
    async upload(body: NodeJS.ReadableStream): Promise<FileEntity> {
        try {
            const streamData = await this.streamToData(body);
            const uploadOptions = { blobHTTPHeaders: { blobContentType: this.mimeType } };
            const uploadResponse = await this._blobClient.uploadData(streamData, uploadOptions);
            return Promise.resolve(this);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    // Define constants
    ONE_MEGABYTE = 1024 * 1024;
    uploadOptions = { bufferSize: 5 * this.ONE_MEGABYTE, maxBuffers: 100 };

    /**
     * Uploads the file stream
     * @param body Readable stream for the file
     * @returns void promise
     */
    async uploadStream(stream: Readable): Promise<void> {
        try {
            const uploadOptions = { blobHTTPHeaders: { blobContentType: this.mimeType } };
            await this._blobClient.uploadStream(stream,
                this.uploadOptions.bufferSize, this.uploadOptions.maxBuffers, uploadOptions);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Converts the stream into buffer
     * @param stream ReadableStream
     * @returns object of type Buffer with all the data
     */
    async streamToData(stream: NodeJS.ReadableStream): Promise<Buffer> {
        const chunks: Buffer[] = []
        for await (const chunk of stream) {
            chunks.push(chunk as Buffer);
        }
        return Buffer.concat(chunks);
    }
    /**
     * Converts ReadableStream into text
     * @param stream ReadableStream to fetch the text from
     * @returns string
     */
    private async streamToText(stream: NodeJS.ReadableStream): Promise<string> {
        stream.setEncoding('utf8');
        let data = '';
        for await (const chunk of stream) {
            data += chunk;
        }
        return data;
    }

}