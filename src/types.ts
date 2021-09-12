export interface ListenerOptions {
    once?: boolean;
    capture?: boolean;
    passive?: boolean;
    signal?: AbortSignal
}


export type TypeListenerOptions = boolean | ListenerOptions | undefined;


export interface EventsMapItem {
    listener: WeakRef<Function>;
    options: TypeListenerOptions
}

export interface EventEmitterItem {
    listener: Function;
    once?: boolean;
}

export interface BaseEvmOptions {
    isInWhiteList: EVMBaseEventListner<boolean>
}


export interface EVMBaseEventListner<T = void>{
    (target: Object, event: string, listener: Function, options: TypeListenerOptions): T 
}

export interface ListenerWrapper {
    listener: Function
}

