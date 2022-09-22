import { ILoggable } from "./ILoggable";

/**
 * Abstract class for a generic logger
 */
export abstract class LoggerAbstract {
    protected client!: ILoggable;
    protected abstract initializeProvider() : void;
}