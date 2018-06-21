import * as React from "react";
import { IStoreSchema } from "reistore";
declare type Diff<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
export declare type MapStateToProps<TState, TStore, TProps, TMap> = (state: TState, props: TProps, store: TStore) => TMap;
export interface IProps<TStore, TState, TProps, TMap> {
    schema: IStoreSchema<TStore, TState>;
    map: MapStateToProps<TState, TStore, Diff<TProps, TMap>, TMap>;
    component: React.ComponentClass<TProps> | ((props: TProps) => any);
    props: Diff<TProps, TMap>;
}
export interface IContext {
    subscribe(connector: Connector<any, any, any, any>): any;
    unSubscribe(connector: Connector<any, any, any, any>): any;
}
export declare const Provider: React.ComponentType<React.ProviderProps<IContext | undefined>>, Consumer: React.ComponentType<React.ConsumerProps<IContext | undefined>>;
export declare class Connector<TStore, TState, TProps, TMap> extends React.Component<IProps<TStore, TState, TProps, TMap>> {
    private connectorContext?;
    private store?;
    private selfContext?;
    private isNeedRemount;
    private connectors;
    private isStoreSubscribe;
    private lastData?;
    constructor(props: any);
    render(): JSX.Element;
    update: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    subscribe: (connector: Connector<any, any, any, any>) => void;
    unSubscribe: (connector: Connector<any, any, any, any>) => void;
}
export declare function connect<TStore, TState, TProps, TMap>(store: IStoreSchema<TStore, TState>, map: MapStateToProps<TState, TStore, Diff<TProps, TMap>, TMap>, component: React.ComponentClass<TProps> | ((props: TProps) => any)): (props: Pick<TProps, Exclude<keyof TProps, keyof TMap>>) => JSX.Element;
export {};
