import { AbstractDomainEntity, Prop } from "../../../models";

export class AuditMetric extends AbstractDomainEntity {
    @Prop()
    metricId?: string;
    @Prop()
    metricType: string = 'cumulative';
    @Prop()
    projectGroupId!: string;
    @Prop()
    userId?: string;
    @Prop()
    value: number = 0;
}