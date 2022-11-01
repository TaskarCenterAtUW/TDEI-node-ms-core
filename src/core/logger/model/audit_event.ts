import { AbstractDomainEntity, Prop } from "../../../models";

export class AuditEvent extends AbstractDomainEntity {

    @Prop()
    requestId!: string;

    @Prop()
    sender!: string;

    @Prop()
    stage!: string;

    @Prop()
    status!: string;

    @Prop()
    description?: string;

    @Prop()
    requestInfo: any;

    @Prop()
    responseInfo: any;

    @Prop()
    isActive: boolean = true;

    @Prop()
    startDate: Date = new Date();
    
    @Prop()
    endDate?: Date;
}