import { IAuthConfig } from "../../abstracts/IAuthConfig";
import { IAuthorizer } from "../../abstracts/IAuthorizer";
import { PermissionRequest } from "../../model/permission_request";

export class LocalAuthorizer implements IAuthorizer{

    // baseUrl: string;
    constructor(config:Partial<IAuthConfig>) {

        // this.baseUrl = config.apiUrl;
    }
    hasPermission(permissionRequest: PermissionRequest): Promise<boolean> {
        return new Promise((resolve,reject)=>{
            resolve(permissionRequest.shouldSatisfyAll);
        });
    }
    
}