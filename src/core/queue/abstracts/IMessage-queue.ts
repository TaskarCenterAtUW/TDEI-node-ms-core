import { QueueMessage } from "../models/queue-message";

export interface IMessageQueue {
    listen(): Promise<void>;
    /**
     * Sends all the pending local messages to the cloud
     */
    send(): Promise<boolean>;

    /**
     * Adds the message to the local queue and waits
     * till `sendNow()` is called and sends all the pending
     * messages at once
     * @param message Message to be added to internal queue
     */
    add(message: QueueMessage): Promise<any>;

    setup():Promise<this>;
}