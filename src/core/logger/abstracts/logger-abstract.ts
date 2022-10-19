import { Config } from "../../../models/config";
import { IAuditor } from "./IAuditor";
import { ILoggable } from "./ILoggable";

/**
 * Abstract class for a generic logger
 */
export abstract class LoggerAbstract {
    protected client!: ILoggable;
    protected auditor!: IAuditor; // Probably better this way
    protected abstract initializeProvider(config : Config) : void;
}