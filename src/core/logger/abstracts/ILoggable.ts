import { QueueMessage } from "../../queue";
import { IAuditor } from "./IAuditor";

export interface ILoggable {
  /**
     * Records a specific metric for logging.
     * This is further used for monitoring and auditing purpose.
     * To filter out the similar metrics for different services, use
     * namespace filter. Each microservice will have a different
     * namespace.
     * @param name Name of the metric
     * @param value Value of the metric (number)
     */
  recordMetric(name: string, value: number): void;

  /**
      * Flushes all the existing messages into the system
      * Use this exclusively to send all the pending logs
      * information to the cloud. Otherwise, there is a
      * delay of about 15 seconds for the application to send
      * the data.
      */
  sendAll(): void;

  /**
      * Record a request into the logger
      * @param req Request object
      * @param res Response object
      */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordRequest(req: any, res: any): void;

  // audit: IAuditor;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(message?: any, ...optionalParams: any[]): void;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(message?: any, ...optionalParams: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordMessage(message:QueueMessage):void;

}
