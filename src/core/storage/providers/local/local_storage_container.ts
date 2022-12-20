import axios from "axios";
import { FileEntity } from "../../abstract/file_entity";
import { StorageContainer } from "../../abstract/storage_container";
import { LocalFileEntity } from "./local_file_entity";

type FileResponse = {
    isDirectory: boolean,
    name: string,
    path: string,
    mimeType: string
}
type FileListResponse = FileResponse[];
// Represents a single root folder
export class LocalStorageContainer implements StorageContainer {

    name: string;

    excludedFiles: string[] = ['.DS_Store'];

    listFiles(): Promise<FileEntity[]> {
        return new Promise(async (resolve, reject) => {
            const url = 'http://localhost:8080/files/list/' + this.name + '/';
            axios.get<FileResponse[]>(url).then((response) => {
                // console.log(response.data);
                // var firstResponse = response.data[0];
                // console.log(firstResponse);
                const files: FileEntity[] = [];
                response.data.forEach((singleResponse) => {
                    if (this.excludedFiles.indexOf(singleResponse.name) === -1) { // Not in any of the excluded files
                        files.push(new LocalFileEntity(singleResponse.path, singleResponse.mimeType));
                    }
                });
                resolve(files);

            }).catch((e) => {
                reject(e);
            });

        });
    }
    createFile(name: string, mimeType: string): FileEntity {
        return new LocalFileEntity(this.name+'/'+name,mimeType);
    }

    constructor(name: string) {
        this.name = name;
    }

}