import * as React from "react";
import { ISchema, IPath } from "reistore";
import { Subscriber, ISubscruberProps } from "./Subscriber";
declare type Diff<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
export declare type MapStateToProps<TState, TStore, TProps, TMap> = (state: TState, props: TProps, store: TStore) => TMap;
export interface IConnectorProps<TStore, TState, TProps, TMap> extends ISubscruberProps<TStore, TProps> {
    schema?: ISchema<TStore, TState>;
    subscriber?: (changes: IPath<TStore, any>[]) => boolean;
    map: MapStateToProps<TState | TStore, TStore, Diff<TProps, TMap>, TMap>;
    props: Diff<TProps, TMap>;
}
export declare class Connector<TStore, TState, TProps, TMap> extends Subscriber<TStore, TProps, IConnectorProps<TStore, TState, TProps, TMap>> {
    private lastData?;
    mapProps: () => TProps;
    isNeedRerender: (changes: IPath<TStore, any>[]) => boolean;
}
export declare function connect<TStore, TState, TProps, TMap>(map?: MapStateToProps<TState | TStore, TStore, Diff<TProps, TMap>, TMap>, schema?: ISchema<TStore, TState>, subscriber?: (changes: IPath<TStore, any>[]) => boolean): (innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any)) => (props: Pick<TProps, Exclude<keyof TProps, keyof TMap>>) => JSX.Element;
export {};
