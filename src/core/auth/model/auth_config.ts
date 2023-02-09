import { Provider, ServiceProvider } from "../../../types/provider";
import { IAuthConfig } from "../abstracts/IAuthConfig";

export class AuthConfig implements IAuthConfig {
    apiUrl: string = process.env.AUTHURL || "";
    provider: ServiceProvider = "Hosted";

    // get the default one.
    static default(): AuthConfig {
        return new AuthConfig();
    }
}