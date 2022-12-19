import axios from "axios";
import { FileEntity } from "../../abstract/file_entity";

export class LocalFileEntity implements FileEntity{

    fileName: string;
    mimeType: string;
    filePath: string;
    rootDownloadPath : string = "http://localhost:8080/files/download/";
    rootUploadPath: string = "http://localhost:8080/files/upload/";

    constructor(name: string ,mimeType: string = 'text/plain') {
        this.filePath = name;
        this.fileName = name.replace(/^.*[\\\/]/, ''); // Get the last name;
        this.mimeType = mimeType;
    }

   async getStream(): Promise<NodeJS.ReadableStream> {

        const response = await axios.get(this.rootDownloadPath+this.filePath,{
            responseType:'stream'
        });
        return Promise.resolve(response.data);
    }
   async getBodyText(): Promise<string> {
        const stream = await this.getStream();
        return Promise.resolve(this.streamToText(stream));
    }

    upload(body: NodeJS.ReadableStream): Promise<FileEntity> {
        throw new Error("Method not implemented.");
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