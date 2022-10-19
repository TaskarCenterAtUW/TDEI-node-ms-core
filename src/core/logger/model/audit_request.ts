import { Prop } from "../../../models";

export class AuditRequest {
    
    @Prop()
    requestId!: string;

    @Prop()
    userId!: string;

    @Prop()
    agencyId!: string;

    @Prop()
    resourceUrl?: string;

    @Prop()
    responseStatus? : string;

    @Prop()
    responseResult? : string;

    @Prop()
    startDate: Date = new Date()

    @Prop()
    endDate?: Date;
}