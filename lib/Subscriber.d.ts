import * as React from "react";
import { Store, IPath, Handler } from "reistore";
export declare const SubscribeProvider: React.ComponentType<React.ProviderProps<ISubscribeProvider | undefined>>, SubscribeConsumer: React.ComponentType<React.ConsumerProps<ISubscribeProvider | undefined>>;
export interface ISubscribeProvider {
    subscribe(subscriber: ISubscriber<any>): any;
    unSubscribe(subscriber: ISubscriber<any>): any;
}
export interface ISubscriber<TProps> extends ISubscribeProvider {
    update: Handler<any>;
    isNeedRerender: (updateList: IPath<any, any>[]) => boolean;
    mapProps: () => TProps;
}
export interface ISubscruberProps<TStore, TProps> {
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any);
    store?: Store<TStore>;
    provider?: ISubscribeProvider;
}
export declare abstract class Subscriber<TState, TMappedProps, TProps extends ISubscruberProps<TState, TMappedProps>> extends React.Component<TProps> implements ISubscriber<TMappedProps> {
    protected selfContext: ISubscribeProvider;
    protected provider?: ISubscribeProvider;
    protected subscribers: ISubscriber<any>[];
    protected isStoreSubscribe: boolean;
    constructor(props: TProps);
    render(): JSX.Element;
    abstract mapProps: () => TMappedProps;
    abstract isNeedRerender: (updateList: IPath<TState, any>[]) => boolean;
    update: (state: TState, updateList: IPath<TState, any>[]) => void;
    shouldComponentUpdate(props: TProps): boolean;
    componentDidMount(): void;
    componentWillUnmount(): void;
    subscribe: (connector: ISubscriber<any>) => void;
    unSubscribe: (connector: ISubscriber<any>) => void;
}
