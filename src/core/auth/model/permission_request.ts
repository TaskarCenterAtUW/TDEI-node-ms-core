export class PermissionRequest {
    userId!: string;
    orgId!: string;
    permssions: string[] = [];
    shouldSatisfyAll: boolean = false;

    // constructor(userId:string,orgId:string,shouldSatisfyAll:boolean = false,roles:string[] = []){
    //     this.orgId = orgId;
    //     this.userId = userId;
    //     this.shouldSatisfyAll = shouldSatisfyAll;
    //     this.permssions = roles;
    // }
    constructor(init?:Partial<PermissionRequest>){
        Object.assign(this,init);
    }

    getSearchParams():URLSearchParams {
        let params = new URLSearchParams();
            params.append("userId", this.userId);
            params.append("agencyId", this.orgId);
            params.append("affirmative", this.shouldSatisfyAll ? "true":"false");
            this.permssions.forEach(x => params.append("roles", x));
        return params;
    }
}