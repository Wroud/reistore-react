import * as React from "react";
import { IStoreSchema, Store } from "reistore";
declare type Diff<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
export declare type MapStateToProps<TState, TStore, TProps, TMap> = (state: TState, props: TProps, store: TStore) => TMap;
export interface IProps<TStore, TState, TProps, TMap> {
    schema: IStoreSchema<TStore, TState>;
    map: MapStateToProps<TState, TStore, Diff<TProps, TMap>, TMap>;
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any);
    props: Diff<TProps, TMap>;
    store?: Store<TStore>;
    parentContext?: IContext;
}
export interface IContext {
    subscribe(connector: Connector<any, any, any, any>): any;
    unSubscribe(connector: Connector<any, any, any, any>): any;
}
export declare class Connector<TStore, TState, TProps, TMap> extends React.Component<IProps<TStore, TState, TProps, TMap>> {
    private selfContext;
    private parentContext?;
    private connectors;
    private isStoreSubscribe;
    private lastData?;
    constructor(props: IProps<TStore, TState, TProps, TMap>);
    render(): JSX.Element;
    shouldComponentUpdate(props: any): boolean;
    update: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    subscribe: (connector: Connector<any, any, any, any>) => void;
    unSubscribe: (connector: Connector<any, any, any, any>) => void;
}
export declare function connect<TStore, TState, TProps, TMap>(schema: IStoreSchema<TStore, TState>, map?: MapStateToProps<TState, TStore, Diff<TProps, TMap>, TMap>): (innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any)) => (props: Pick<TProps, Exclude<keyof TProps, keyof TMap>>) => JSX.Element;
export {};
