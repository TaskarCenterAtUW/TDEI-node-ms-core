import { Readable } from "stream";

/**
 * Abstract class for file entity
 */
export abstract class FileEntity {
    fileName: string;
    mimeType: string;
    filePath: string;
    remoteUrl: string;

    constructor(name: string, mimeType: string = "text/plain") {
        this.fileName = name;
        this.mimeType = mimeType;
        this.filePath = name;
        this.remoteUrl = '';
    }

    /**
     * Fetches the Readable stream of the file
     */
    abstract getStream(): Promise<Readable>;

    /**
     * Fetches the content of the file as plan text
     */
    abstract getBodyText(): Promise<string>;

    /**
     * Upload the content for this file
     * @param body ReadableStream of the file content
     */
    abstract upload(body: NodeJS.ReadableStream): Promise<FileEntity>;

    /**
     * Uploads the file stream
     * @param body Readable stream for the file
     * @returns void promise
     */
    abstract uploadStream(stream: Readable): Promise<void>;

    /**
     * Deletes a file from the container
     * @returns Promise of void
     */
    abstract deleteFile(): Promise<void>;
}
