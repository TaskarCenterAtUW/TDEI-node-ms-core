import { Prop } from "../../../decorators/prop.decorator";
import { AbstractDomainEntity } from "../../../models/base/abstract-domain-entity";


/**
 * Abstract model for Queue Message entity
 * This class can be extended and used for the
 * remaining types based on the event type
 */
export class QueueMessage extends AbstractDomainEntity {
    
    /**
     * Unique message ID to represent this message
     */
    @Prop()
    messageId!:string;

    /**
     * Message type for this queue message
     */
    @Prop()
    messageType!:string;

    /**
     * Published Date for the queue message.
     * Defaults to local time if not specified.
     */
    @Prop()
    publishedDate:Date = new Date();

    /**
     * Optional message string for the message
     */
    @Prop()
    message:string | undefined;

}