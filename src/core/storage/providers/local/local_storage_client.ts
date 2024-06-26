import path from "path";
import { NotFoundResourceError } from "../../../../utils/resource-errors/not-found-resource-error";
import { FileEntity } from "../../abstract/file_entity";
import { StorageClient } from "../../abstract/storage_client";
import { StorageContainer } from "../../abstract/storage_container";
import { LocalFileEntity } from "./local_file_entity";
import { LocalStorageContainer } from "./local_storage_container";
import fs from 'fs';

export class LocalStorageClient implements StorageClient {

    private serverRoot: string;

    constructor(serverRoot: string) {
        this.serverRoot = serverRoot;
    }

    cloneFile(fileUrl: string, destinationContainerName: string, destinationFilePath: string): Promise<FileEntity> {
        return new Promise((resolve, reject) => {
            this.getFileFromUrl(fileUrl).then((file) => {
                const destinationPath = path.join(destinationContainerName, destinationFilePath);
                fs.copyFile(file.filePath, path.join(this.serverRoot, destinationPath), (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(new LocalFileEntity(destinationPath, this.serverRoot, file.mimeType));
                    }
                });
            }).catch((e) => {
                reject(e);
            });
        });
    }

    getContainer(name: string): Promise<StorageContainer> {
        return new Promise((resolve, reject) => {
            resolve(new LocalStorageContainer(name, this.serverRoot));
        });
    }
    getFile(containerName: string, fileName: string): Promise<FileEntity> {
        const fullPath = path.join(containerName, fileName);
        return new Promise((resolve, reject) => {
            const container = new LocalStorageContainer(containerName, this.serverRoot);
            container.listFiles().then((allFiles) => {
                const theFile = allFiles.find((obj) => {
                    return obj.filePath === fullPath;
                });
                if (theFile !== undefined) {
                    resolve(theFile);
                }
                else {
                    const nfe = new NotFoundResourceError('404');
                    reject(nfe);
                }
            }).catch((e) => {
                reject(e);
            })
            // resolve(new LocalFileEntity(path.join(containerName,fileName),this.serverRoot));
        });
    }
    getFileFromUrl(fullUrl: string): Promise<FileEntity> {
        const url = new URL(fullUrl);
        const filePath = url.pathname;
        const fileComponents = filePath.split('/');
        const containerName = fileComponents[1];
        const fileRelativePath = fileComponents.slice(2).join('/');
        return this.getFile(containerName, fileRelativePath);
    }

    getSASUrl(containerName: string, filePath: string, expiryInHours: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getFile(containerName, filePath).then((file) => {
                resolve(file.remoteUrl);
            }).catch((e) => {
                reject(e);
            });
        });
    }

}