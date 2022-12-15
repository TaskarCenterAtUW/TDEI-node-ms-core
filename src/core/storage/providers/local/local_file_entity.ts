import { FileEntity } from "../../abstract/file_entity";

export class LocalFileEntity implements FileEntity{

    fileName: string;
    mimeType: string;
    filePath: string;

    constructor(name: string ,mimeType: string = 'text/plain') {
        this.filePath = name;
        this.fileName = name.replace(/^.*[\\\/]/, ''); // Get the last name;
        this.mimeType = mimeType;
    }

    getStream(): Promise<NodeJS.ReadableStream> {
        throw new Error("Method not implemented.");
    }
    getBodyText(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    upload(body: NodeJS.ReadableStream): Promise<FileEntity> {
        throw new Error("Method not implemented.");
    }

}