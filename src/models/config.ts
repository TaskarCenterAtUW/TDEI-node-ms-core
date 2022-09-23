import { NestedModel } from "../decorators";
import { Prop } from ".";
import { AbstractDomainEntity } from "./base/abstract-domain-entity";



type Provider = "Azure" | "GCP" | "AWS";

class ConnectionString extends AbstractDomainEntity{

    @Prop()
    serviceBus!: string;
    @Prop()
    blobStorage!: string;
    @Prop()
    appInsights!: string;
}

class CloudConfig extends AbstractDomainEntity {

    @Prop()
    @NestedModel(ConnectionString)
    connectionString!: ConnectionString;

    queueNames: string[] = [];
}



export class Config extends AbstractDomainEntity{
    @Prop()
    provider!: Provider;

    @Prop()
    @NestedModel(CloudConfig)
    cloudConfig!: CloudConfig;

}