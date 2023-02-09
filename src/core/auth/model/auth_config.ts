import { Provider, ServiceProvider } from "../../../types/provider";
import { IAuthConfig } from "../abstracts/IAuthConfig";

/**
 * Authentication Configuration
 * contains a service provider and `apiUrl`
 * If `apiUrl` is not provided, picks up from 
 * `AUTHURL` environment variable
 */
export class AuthConfig implements IAuthConfig {

    /// url to be called in case it is a hosted configuration
    apiUrl: string = process.env.AUTHURL || "";
    
    /// Provider. Can be "Hosted" or "Simulated"
    provider: ServiceProvider = "Hosted";

    /**
     * Gets default AuthConfig
     * @returns Default AuthConfig with "Hosted" provider and
     *          `apiUrl` same as `AUTHURL` environment variable
     */
    static default(): AuthConfig {
        return new AuthConfig();
    }
}