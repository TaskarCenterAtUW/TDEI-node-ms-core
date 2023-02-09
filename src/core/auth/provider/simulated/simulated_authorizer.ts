import { IAuthConfig } from "../../abstracts/IAuthConfig";
import { IAuthorizer } from "../../abstracts/IAuthorizer";
import { PermissionRequest } from "../../model/permission_request";

/**
 * Simulates the authorization.
 * Authorization is based on the `shouldSatisfyAll` parameter
 * passed in the permission request
 */
export class SimulatedAuthorizer implements IAuthorizer{

    /**
     * Simulated Authorizer. Does simulated check for authorization.
     * @param config Partial configuration with provider as `Simulated`
     */
    constructor(config:Partial<IAuthConfig>) {
        // Do nothing
    }
    /**
     * 
     * @param permissionRequest Permission request instance
     * @returns Promise<boolean> or an exception
     */
    hasPermission(permissionRequest: PermissionRequest): Promise<boolean> {
        return new Promise((resolve,reject)=>{
            resolve(permissionRequest.shouldSatisfyAll);
        });
    }
    
}