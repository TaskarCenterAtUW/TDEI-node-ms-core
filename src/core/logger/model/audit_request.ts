import { AbstractDomainEntity, Prop } from "../../../models";

export class AuditRequest extends AbstractDomainEntity {

    @Prop()
    requestId!: string;

    @Prop()
    userId!: string;

    @Prop()
    projectGroupId!: string;

    @Prop()
    resourceUrl?: string;

    @Prop()
    responseStatus?: string;

    @Prop()
    responseResult?: string;

    @Prop()
    startDate: Date = new Date()

    @Prop()
    endDate?: Date;
}