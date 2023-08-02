import { PermissionRequest } from "../model/permission_request";

export interface IAuthorizer {
    hasPermission(permissionRequest:PermissionRequest):Promise<boolean>;
}