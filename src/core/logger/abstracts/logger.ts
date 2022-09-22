import { ILoggable } from "./ILoggable";

/**
 * Abstract class for a generic logger
 */
export abstract class Logger {
    public client!: ILoggable;
    abstract initializeProvider() : void;
}