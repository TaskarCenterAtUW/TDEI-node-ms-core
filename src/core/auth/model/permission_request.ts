/**
 * Object for requesting the Permission.
 */
export class PermissionRequest {
    /// userID of the user
    userId!: string;

    /// OrganizationID or agencyID
    orgId!: string;

    /// list of permissions
    permssions: string[] = [];

    /// Whether all should be present or anyone of the permissions to be present
    shouldSatisfyAll: boolean = false;

    constructor(init?:Partial<PermissionRequest>){
        Object.assign(this,init);
    }

    /**
     * Internal method for getting the search parameters.
     * @returns URLSearchParams
     */
    getSearchParams():URLSearchParams {
        let params = new URLSearchParams();
            params.append("userId", this.userId);
            params.append("agencyId", this.orgId);
            params.append("affirmative", this.shouldSatisfyAll ? "true":"false");
            this.permssions.forEach(x => params.append("roles", x));
        return params;
    }
}