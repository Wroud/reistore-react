import * as React from "react";
import { Store } from "reistore";
import { StoreConsumer } from "./StoreProvider";
import { IPrimitive, Primitive } from "./Primitive";
import { ISubscruberProps, Subscriber, SubscribeConsumer } from "./Subscriber";

type Diff<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
export interface IPrimitivesMap<TState> {
    [key: string]: IPrimitive<TState>;
};

export type PrimitivesMapInit<Map extends IPrimitivesMap<any>> = {
    [P in keyof Map]: Map[P] extends new (store: Store<any>) => infer T ? T : never;
};

export interface IProps<TStore, TProps extends PrimitivesMapInit<TMap>, TMap extends IPrimitivesMap<TStore>> extends ISubscruberProps<TStore, TProps> {
    map: TMap;
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any);
    props: Diff<TProps, PrimitivesMapInit<TMap>>;
}

export class PrimitiveConnector<TStore, TProps extends PrimitivesMapInit<TMap>, TMap extends IPrimitivesMap<TStore>>
    extends Subscriber<TStore, TProps, IProps<TStore, TProps, TMap>>
{
    private initMap!: PrimitivesMapInit<TMap>;
    mapProps = () => {
        const { store } = this.props;
        const { map, props } = this.props;
        this.initMap = {} as any;
        if (store) {
            Object.keys(map).forEach(key => {
                const primitive = new map[key](store);
                primitive.loadState(props)
                this.initMap[key] = primitive as any;
            });
        }
        return { ...this.initMap as any, ...props as any } as TProps;
    }
    isNeedRerender = () => {
        const { store } = this.props;
        if (!store) {
            return false;
        }
        const { map, props } = this.props;
        const newMap: PrimitivesMapInit<TMap> = {} as any;
        const curKeys = Object.keys(this.initMap || {});
        const newKeys = Object.keys(map);
        if (store) {
            newKeys.forEach(key => {
                const primitive = new map[key](store);
                primitive.loadState(props)
                newMap[key] = primitive as any;
            });
        }
        if (curKeys.length !== newKeys.length
            || curKeys.some(key =>
                (this.initMap[key] as any as Primitive<TStore>).state
                !== (newMap[key] as any as Primitive<TStore>).state
            )
        ) {
            this.initMap = newMap;
            return true;
        }
        return false;
    }
}

export function withPrimitive<TStore, TProps extends PrimitivesMapInit<TMap>, TMap extends IPrimitivesMap<TStore>>(
    map: TMap
) {
    return (innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any)) =>
        (props: Diff<TProps, PrimitivesMapInit<TMap>>) => (
            <StoreConsumer>
                {store => (
                    <SubscribeConsumer>
                        {context => (
                            <PrimitiveConnector<TStore, TProps, TMap>
                                map={map}
                                store={store}
                                innerComponent={innerComponent}
                                props={props}
                            />
                        )}
                    </SubscribeConsumer>
                )}
            </StoreConsumer>
        );
}
