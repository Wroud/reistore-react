import * as React from "react";
import { isScope, IStoreSchema, Store } from "reistore";
import { shallowEqual } from "./shallowEqual";
import { StoreConsumer } from "./StoreProvider";

type Diff<T, K> = Pick<T, Exclude<keyof T, keyof K>>;
export type MapStateToProps<TState, TStore, TProps, TMap> = (state: TState, props: TProps, store: TStore) => TMap;

export interface IProps<TStore, TState, TProps, TMap> {
    schema: IStoreSchema<TStore, TState>;
    map: MapStateToProps<TState, TStore, Diff<TProps, TMap>, TMap>;
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any);
    props: Diff<TProps, TMap>;
}
export interface IContext {
    subscribe(connector: Connector<any, any, any, any>);
    unSubscribe(connector: Connector<any, any, any, any>);
}

export const { Provider, Consumer } = React.createContext<IContext | undefined>(undefined);

export class Connector<TStore, TState, TProps, TMap> extends React.Component<IProps<TStore, TState, TProps, TMap>> {
    private connectorContext?: IContext;
    private store?: Store<TStore>;
    private selfContext?: IContext;
    private isNeedRemount: boolean;
    private connectors: Array<Connector<any, any, any, any>>;
    private isStoreSubscribe: boolean;
    private lastData?: TMap;
    constructor(props) {
        super(props);
        this.connectors = [];
        this.isNeedRemount = false;
        this.isStoreSubscribe = false;
        this.selfContext = {
            subscribe: this.subscribe,
            unSubscribe: this.unSubscribe
        };
    }
    render() {
        return (
            <StoreConsumer>
                {store => (
                    <Consumer>
                        {context => {
                            this.store = store;
                            if ((this.isStoreSubscribe || this.connectorContext) && this.connectorContext !== context) {
                                this.isNeedRemount = true;
                                this.componentWillUnmount();
                            }
                            this.connectorContext = context;
                            if (this.isNeedRemount) {
                                this.componentDidMount();
                                this.isNeedRemount = false;
                            }
                            const { schema, map, innerComponent: InnerComponent, props, children } = this.props;
                            if (store) {
                                this.lastData = isScope<TStore, any, TState>(schema)
                                    ? map(schema.getState(store.state), props, store.state)
                                    : map(schema.getState(store.state), props, store.state) as any;
                            }
                            return (
                                <Provider value={this.selfContext}>
                                    <InnerComponent {...this.lastData} {...props} children={children} />
                                </Provider>
                            );
                        }}
                    </Consumer>
                )}
            </StoreConsumer>
        );
    }
    update = () => {
        if (!this.store) {
            return;
        }
        const { schema, map, props } = this.props;
        const mapped = isScope<TStore, any, TState>(schema)
            ? map(schema.getState(this.store.state), props, this.store.state)
            : map(schema.getState(this.store.state), props, this.store.state) as any;

        if (!shallowEqual(this.lastData, mapped)) {
            this.lastData = mapped;
            this.forceUpdate();
        } else {
            for (const connector of this.connectors) {
                connector.update();
            }
        }
    }
    componentDidMount() {
        if (this.connectorContext) {
            this.connectorContext.subscribe(this);
        } else {
            if (!this.store) {
                return;
            }
            this.store.updateHandler.subscribe(this.update);
            this.isStoreSubscribe = true;
        }
    }
    componentWillUnmount() {
        if (this.isStoreSubscribe) {
            if (!this.store) {
                return;
            }
            this.store.updateHandler.unSubscribe(this.update);
            this.isStoreSubscribe = false;
        } else if (this.connectorContext) {
            this.connectorContext.unSubscribe(this);
        }
    }
    subscribe = (connector: Connector<any, any, any, any>) => {
        this.connectors.push(connector);
    }
    unSubscribe = (connector: Connector<any, any, any, any>) => {
        const id = this.connectors.indexOf(connector);
        if (id > -1) {
            this.connectors.splice(id, 1);
        }
    }
}

export function connect<TStore, TState, TProps, TMap>(
    store: IStoreSchema<TStore, TState>,
    map: MapStateToProps<TState, TStore, Diff<TProps, TMap>, TMap>,
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any)
) {
    return (props: Diff<TProps, TMap>) => (
        <Connector<TStore, TState, TProps, TMap> schema={store} map={map} innerComponent={innerComponent} props={props} />
    );
}
