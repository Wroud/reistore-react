import { Store } from "reistore";

export interface IPrimitive<TStore, T = {}, TProps = {}> {
    new(store: Store<TStore>): Primitive<TStore, T, TProps>;
}

export type MapState<TState, TProps, TMap> = (state: TState, props: TProps) => TMap;
export class Primitive<TStore, T = {}, TProps={}> {
    state!: T;
    props!: TProps;
    protected store: Store<TStore>;
    protected map!: MapState<TStore, TProps, T>;
    constructor(store: Store<TStore>) {
        this.store = store;
    }
    loadState(props?: TProps) {
        if (this.map) {
            this.state = this.map(this.store.state, props as TProps);
        }
        this.props = props as TProps;
        return this;
    }
    protected init<TPrimitive extends Primitive<TStore, any, any>>(
        primitive: new (store: Store<TStore>) => TPrimitive
    ) {
        const prim = new primitive(this.store);
        return prim.loadState as typeof prim["loadState"];
    }
}

