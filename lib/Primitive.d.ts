import { Store } from "reistore";
export interface IPrimitive<TStore, T = {}, TProps = {}> {
    new (store: Store<TStore>): Primitive<TStore, T, TProps>;
}
export declare type MapState<TState, TProps, TMap> = (state: TState, props: TProps) => TMap;
export declare class Primitive<TStore, T = {}, TProps = {}> {
    state: T;
    props: TProps;
    protected store: Store<TStore>;
    protected map: MapState<TStore, TProps, T>;
    constructor(store: Store<TStore>);
    loadState(props?: TProps): this;
    protected init<TPrimitive extends Primitive<TStore, any, any>>(primitive: new (store: Store<TStore>) => TPrimitive): TPrimitive["loadState"];
}
