import axios from "axios";
import path from "path";
import { FileEntity } from "../../abstract/file_entity";
const FormData = require('form-data');

export class LocalFileEntity implements FileEntity{

    fileName: string;
    mimeType: string;
    filePath: string;
    rootDownloadPath : string = "/files/download/";
    rootUploadPath: string = "/files/upload/";
    serverRoot:string;
    remoteUrl: string;

    constructor(name: string ,serverRoot:string,mimeType: string = 'text/plain') {
        this.filePath = name;
        this.fileName = name.replace(/^.*[\\\/]/, ''); // Get the last name;
        this.mimeType = mimeType;
        this.serverRoot = serverRoot;
        this.remoteUrl = path.join(serverRoot,this.filePath);

    }

   async getStream(): Promise<NodeJS.ReadableStream> {
        const downloadRelativePath = path.join(this.rootDownloadPath, this.filePath);
        const response = await axios.get(this.serverRoot+downloadRelativePath,{
            responseType:'stream'
        });
        return Promise.resolve(response.data);
    }
   async getBodyText(): Promise<string> {
        const stream = await this.getStream();
        return Promise.resolve(this.streamToText(stream));
    }

    async upload(body: NodeJS.ReadableStream): Promise<FileEntity> {

        // Get the directory from file path
        const relativePath = path.join(this.rootUploadPath, this.filePath);
        const directoryPath = this.serverRoot + path.dirname(relativePath);//fullUploadPath.substring(0,fullUploadPath.indexOf(this.fileName)-1);
        const formData = new FormData();
        formData.append('uploadFile',body);
        const response = await axios.post(directoryPath,formData);
        return Promise.resolve(this);
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