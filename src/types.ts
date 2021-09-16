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
    isInWhiteList: EVMBaseEventListener<boolean>,
    maxContentLength?: number;
}


export interface EVMBaseEventListener<T = void>{
    (target: Object, event: string, listener: Function, options: TypeListenerOptions): T 
}

export interface ListenerWrapper {
    listener: Function
}

export interface StatisticsOpitons{
    containsContent?: boolean
}