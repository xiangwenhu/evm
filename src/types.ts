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

export interface ISameOptions {
    <T = any>(options1: T, options2: T): boolean;
}

export interface ISameFunction {
    (fn1: any, fn2: any, ...args: any[]): boolean;
}

export interface BaseEvmOptions {
    isSameOptions?: ISameOptions;
    isInWhiteList?: EVMBaseEventListener<boolean>;
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

export interface EvmEventsMapOptions {
    isSameOptions: ISameOptions;
    isSameFunction(fun1: Function, fun2: Function): boolean;
}


export type EventType = string | Symbol | number;