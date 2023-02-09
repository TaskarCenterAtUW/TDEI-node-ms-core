import axios from "axios";
import { IAuthConfig } from "../../abstracts/IAuthConfig";
import { IAuthorizer } from "../../abstracts/IAuthorizer";
import { PermissionRequest } from "../../model/permission_request";

export class AzureAuthorizer implements IAuthorizer {

    baseUrl: string;

    constructor(config:IAuthConfig) {

        this.baseUrl = config.apiUrl!;
    }

    hasPermission(permissionRequest: PermissionRequest): Promise<boolean> {
        
        return new Promise((resolve,reject)=>{
            if(permissionRequest.permssions.length == 0){
                reject("No roles provided");
            }
            const permissionSearch = permissionRequest.getSearchParams();
            axios.get<boolean>(this.baseUrl,{params:permissionSearch}).then((response)=>{
                 resolve(response.data);
            }).catch((e)=>{
                reject(e);
            });
        });        
    }

}