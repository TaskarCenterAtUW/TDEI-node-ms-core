import { Prop } from "../../../models";

export class AuditEvent {

    @Prop()
    requestId!: string;
    @Prop()
    sender!: string;
    @Prop()
    stage!: string;
    @Prop()
    status!:string;
    @Prop()
    description?:string;
    @Prop()
    requestInfo:any;
    @Prop()
    responseInfo:any;
    @Prop()
    isActive:boolean = true;
    @Prop()
    startDate: Date = new Date();
    @Prop()
    endDate?: Date;
}