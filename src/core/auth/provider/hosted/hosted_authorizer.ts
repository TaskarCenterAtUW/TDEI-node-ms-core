import axios from "axios";
import { IAuthConfig } from "../../abstracts/IAuthConfig";
import { IAuthorizer } from "../../abstracts/IAuthorizer";
import { PermissionRequest } from "../../model/permission_request";

/**
 * Checks and confirms the permission for a user
 * `apiUrl` to be configured in the constructor
 */
export class HostedAuthorizer implements IAuthorizer {

    baseUrl: string;

    /**
     *
     * @param config IAuthConfig element. Should have `apiUrl`
     */
    constructor(config:IAuthConfig) {

        this.baseUrl = config.apiUrl!;
    }

    /**
     *
     * @param permissionRequest PermissionRequest . PermissionRequest should have atleast one permssion
     * @returns Promise<boolean> or exception
     *
     */
    hasPermission(permissionRequest: PermissionRequest): Promise<boolean> {

        return new Promise((resolve,reject)=>{
            if(permissionRequest.permssions.length === 0){
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