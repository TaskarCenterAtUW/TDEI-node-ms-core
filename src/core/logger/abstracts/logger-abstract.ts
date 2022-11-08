
import { ILoggerConfig } from "../../../models/abstracts/iloggerconfig";
import { IAnalytics } from "./IAnalytics";
import { IAuditor } from "./IAuditor";
import { ILoggable } from "./ILoggable";

/**
 * Abstract class for a generic logger
 */
export abstract class LoggerAbstract {
    // protected client!: ILoggable;
    protected auditor!: IAuditor; // Probably better this way
    protected analytic!: IAnalytics;
    protected abstract initializeProvider(config : ILoggerConfig) : void;
}