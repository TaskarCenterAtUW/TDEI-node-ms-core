import { Channel, ConfirmChannel, Connection, ConsumeMessage, GetMessage, Message, Options, Replies, ServerProperties } from "amqplib";

export class MockConnection implements Connection{
    close(): Promise<void> {
        return Promise.resolve();
    }
    createChannel(): Promise<Channel> {
        
        return Promise.resolve(new MockChannel());
    }
    createConfirmChannel(): Promise<ConfirmChannel> {
        throw new Error("Method not implemented.");
    }
    connection: { serverProperties: ServerProperties; };

    constructor(){
        this.connection = {
            serverProperties:{
                host:'',
                product:'',
                version:'',
                platform:'',
                information:''
            }
        }
    }
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    removeAllListeners(event?: string | symbol | undefined): this {
        throw new Error("Method not implemented.");
    }
    setMaxListeners(n: number): this {
        throw new Error("Method not implemented.");
    }
    getMaxListeners(): number {
        throw new Error("Method not implemented.");
    }
    listeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    rawListeners(eventName: string | symbol): Function[] {
        throw new Error("Method not implemented.");
    }
    emit(eventName: string | symbol, ...args: any[]): boolean {
        throw new Error("Method not implemented.");
    }
    listenerCount(eventName: string | symbol): number {
        throw new Error("Method not implemented.");
    }
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    eventNames(): (string | symbol)[] {
        throw new Error("Method not implemented.");
    }

}

export class MockChannel implements Channel {
    close(): Promise<void> {
        return Promise.resolve();
    }
    assertQueue(queue: string, options?: Options.AssertQueue | undefined): Promise<Replies.AssertQueue> {
        return Promise.resolve({
            queue: queue,
            messageCount: 1,
            consumerCount: 1
        })
    }
    checkQueue(queue: string): Promise<Replies.AssertQueue> {
        return Promise.resolve({
            queue: queue,
            messageCount: 1,
            consumerCount: 1
        })
    }
    deleteQueue(queue: string, options?: Options.DeleteQueue | undefined): Promise<Replies.DeleteQueue> {
        return Promise.resolve({
            queue: queue,
            messageCount: 1,
            consumerCount: 1
        })
    }
    purgeQueue(queue: string): Promise<Replies.PurgeQueue> {
        return Promise.resolve({messageCount:0})
    }
    bindQueue(queue: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    unbindQueue(queue: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    assertExchange(exchange: string, type: string, options?: Options.AssertExchange | undefined): Promise<Replies.AssertExchange> {
        return Promise.resolve({exchange:exchange})
    }
    checkExchange(exchange: string): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    deleteExchange(exchange: string, options?: Options.DeleteExchange | undefined): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    bindExchange(destination: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    unbindExchange(destination: string, source: string, pattern: string, args?: any): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    publish(exchange: string, routingKey: string, content: Buffer, options?: Options.Publish | undefined): boolean {
        return true;
    }
    sendToQueue(queue: string, content: Buffer, options?: Options.Publish | undefined): boolean {
        return true;
    }
    consume(queue: string, onMessage: (msg: ConsumeMessage | null) => void, options?: Options.Consume | undefined): Promise<Replies.Consume> {
        return Promise.resolve({consumerTag:''});
    }
    cancel(consumerTag: string): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    get(queue: string, options?: Options.Get | undefined): Promise<false | GetMessage> {
        return Promise.resolve(false);
    }
    ack(message: Message, allUpTo?: boolean | undefined): void {
        
    }
    ackAll(): void {
        
    }
    nack(message: Message, allUpTo?: boolean | undefined, requeue?: boolean | undefined): void {
        
    }
    nackAll(requeue?: boolean | undefined): void {
        
    }
    reject(message: Message, requeue?: boolean | undefined): void {
        
    }
    prefetch(count: number, global?: boolean | undefined): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    recover(): Promise<Replies.Empty> {
        return Promise.resolve({});
    }
    addListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    on(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    once(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    off(eventName: string | symbol, listener: (...args: any[]) => void): this {
        return this;
    }
    removeAllListeners(event?: string | symbol | undefined): this {
        return this;
    }
    setMaxListeners(n: number): this {
        return this;
    }
    getMaxListeners(): number {
        return 2;
    }
    listeners(eventName: string | symbol): Function[] {
        // throw new Error("Method not implemented.");
        return [];
    }
    rawListeners(eventName: string | symbol): Function[] {
        // throw new Error("Method not implemented.");
        return [];
    }
    emit(eventName: string | symbol, ...args: any[]): boolean {
        return true;
    }
    listenerCount(eventName: string | symbol): number {
        throw new Error("Method not implemented.");
    }
    prependListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    prependOnceListener(eventName: string | symbol, listener: (...args: any[]) => void): this {
        throw new Error("Method not implemented.");
    }
    eventNames(): (string | symbol)[] {
        throw new Error("Method not implemented.");
    }

}