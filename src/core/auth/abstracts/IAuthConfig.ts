import { ServiceProvider } from "../../../types/provider";

export interface IAuthConfig {
        provider: ServiceProvider;
        apiUrl:string|null;
}