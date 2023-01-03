import path from "path";
import { NotFoundResourceError } from "../../../../utils/resource-errors/not-found-resource-error";
import { FileEntity } from "../../abstract/file_entity";
import { StorageClient } from "../../abstract/storage_client";
import { StorageContainer } from "../../abstract/storage_container";
import { LocalFileEntity } from "./local_file_entity";
import { LocalStorageContainer } from "./local_storage_container";

export class LocalStorageClient implements StorageClient {

    private serverRoot: string;

    constructor(serverRoot: string){
        this.serverRoot = serverRoot;
    }
    getContainer(name: string): Promise<StorageContainer> {
        return new Promise((resolve, reject) => {
            resolve(new LocalStorageContainer(name, this.serverRoot));
        });
    }
    getFile(containerName: string, fileName: string): Promise<FileEntity> {
        let fullPath = path.join(containerName,fileName);
        return new Promise((resolve,reject)=>{
            let container = new LocalStorageContainer(containerName,this.serverRoot);
            container.listFiles().then((allFiles)=>{
              const theFile =   allFiles.find((obj)=>{
                    return obj.filePath  == fullPath;
                });
                if(theFile != undefined){
                    resolve(theFile);
                }
                else {
                    const nfe = new NotFoundResourceError('404');
                    reject(nfe);
                }
            }).catch((e)=>{
                reject(e);
            })
            // resolve(new LocalFileEntity(path.join(containerName,fileName),this.serverRoot));
        });
    }
    getFileFromUrl(fullUrl: string): Promise<FileEntity> {
        const url = new  URL(fullUrl);
        const filePath = url.pathname;
        const fileComponents = filePath.split('/');
        const containerName = fileComponents[1];
        const fileRelativePath = fileComponents.slice(2).join('/');
        return this.getFile(containerName,fileRelativePath);
    }

}