import * as React from "react";
import { Store } from "reistore";
import { IPrimitive } from "./Primitive";
import { ISubscruberProps, Subscriber } from "./Subscriber";
declare type Diff<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
export interface IPrimitivesMap<TState> {
    [key: string]: IPrimitive<TState>;
}
export declare type PrimitivesMapInit<Map extends IPrimitivesMap<any>> = {
    [P in keyof Map]: Map[P] extends new (store: Store<any>) => infer T ? T : never;
};
export interface IProps<TStore, TProps extends PrimitivesMapInit<TMap>, TMap extends IPrimitivesMap<TStore>> extends ISubscruberProps<TStore, TProps> {
    map: TMap;
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any);
    props: Diff<TProps, PrimitivesMapInit<TMap>>;
}
export declare class PrimitiveConnector<TStore, TProps extends PrimitivesMapInit<TMap>, TMap extends IPrimitivesMap<TStore>> extends Subscriber<TStore, TProps, IProps<TStore, TProps, TMap>> {
    private initMap;
    mapProps: () => TProps;
    isNeedRerender: () => boolean;
}
export declare function withPrimitive<TStore, TProps extends PrimitivesMapInit<TMap>, TMap extends IPrimitivesMap<TStore>>(map: TMap): (innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any)) => (props: Pick<TProps, Exclude<keyof TProps, keyof TMap>>) => JSX.Element;
export {};
