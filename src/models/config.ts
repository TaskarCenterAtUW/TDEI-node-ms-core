export class Config {
    provider!: Provider;

    azure!: Azure;

    static from(configJson: string): Config {
        return Object.assign(new Config(), configJson);
    }
}

type Provider = "Azure" | "GCP" | "AWS";

class Azure {
    connectionString: ConnectionString = new ConnectionString();
    queueNames: string[] = [];
}

class ConnectionString {
    serviceBus!: string;
    blobStorage!: string;
    appInsights!: string;
}