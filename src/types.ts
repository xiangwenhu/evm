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


export interface EVMBaseEventListener<R = void, ET = EventType> {
    (target: Object, event: ET, listener: Function, options: TypeListenerOptions): R
}

export interface ListenerWrapper {
    listener: Function
}

export interface StatisticsOpitons {
    containsContent?: boolean
}


export type EventType = string | Symbol | number;