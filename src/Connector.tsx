import * as React from "react";
import { ISchema, IPath } from "reistore";
import { shallowEqual } from "./shallowEqual";
import { StoreConsumer } from "./StoreProvider";
import { Subscriber, SubscribeConsumer, ISubscruberProps } from "./Subscriber";

type Diff<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
export type MapStateToProps<TState, TStore, TProps, TMap> = (state: TState, props: TProps, store: TStore) => TMap;

export interface IConnectorProps<TStore, TState, TProps, TMap> extends ISubscruberProps<TStore, TProps> {
    schema?: ISchema<TStore, TState>;
    subscriber?: (changes: IPath<TStore, any>[]) => boolean;
    map: MapStateToProps<TState | TStore, TStore, Diff<TProps, TMap>, TMap>;
    props: Diff<TProps, TMap>;
}

export class Connector<TStore, TState, TProps, TMap>
    extends Subscriber<TStore, TProps, IConnectorProps<TStore, TState, TProps, TMap>>
{
    private lastData?: TMap;
    mapProps = () => {
        const { store } = this.props;
        const { schema, map, props } = this.props;
        if (store) {
            this.lastData = map((schema || store.schema).getState(store), props, store.state);
        }
        return { ...this.lastData as any, ...props as any } as TProps;
    }
    isNeedRerender = (changes: IPath<TStore, any>[]) => {
        const { store, subscriber } = this.props;
        if (subscriber) {
            return subscriber(changes);
        }
        if (!store) {
            return false;
        }
        const { schema, map, props } = this.props;
        const mapped = map((schema || store.schema).getState(store), props, store.state);

        if (!shallowEqual(this.lastData, mapped)) {
            this.lastData = mapped;
            return true;
        }
        return false;
    }
}

export function connect<TStore, TState, TProps, TMap>(
    map: MapStateToProps<TState | TStore, TStore, Diff<TProps, TMap>, TMap> = (f => f as any),
    schema?: ISchema<TStore, TState>,
    subscriber?: (changes: IPath<TStore, any>[]) => boolean
) {
    return (innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any)) =>
        (props: Diff<TProps, TMap>) => (
            <StoreConsumer>
                {store => (
                    <SubscribeConsumer>
                        {context => (
                            <Connector<TStore, TState, TProps, TMap>
                                schema={schema}
                                map={map}
                                store={store}
                                provider={context}
                                innerComponent={innerComponent}
                                subscriber={subscriber}
                                props={props}
                            />
                        )}
                    </SubscribeConsumer>
                )}
            </StoreConsumer>
        );
}
