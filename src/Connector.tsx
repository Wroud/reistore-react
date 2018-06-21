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
    store?: Store<TStore>;
    parentContext?: IContext;
}
export interface IContext {
    subscribe(connector: Connector<any, any, any, any>);
    unSubscribe(connector: Connector<any, any, any, any>);
}

const { Provider, Consumer } = React.createContext<IContext | undefined>(undefined);

export class Connector<TStore, TState, TProps, TMap> extends React.Component<IProps<TStore, TState, TProps, TMap>> {
    private selfContext: IContext;
    private parentContext?: IContext;
    private connectors: Array<Connector<any, any, any, any>>;
    private isStoreSubscribe: boolean;
    private lastData?: TMap;
    constructor(props: IProps<TStore, TState, TProps, TMap>) {
        super(props);
        this.connectors = [];
        this.isStoreSubscribe = false;
        this.parentContext = props.parentContext;
        this.selfContext = {
            subscribe: this.subscribe,
            unSubscribe: this.unSubscribe
        };
    }
    render() {
        const { store } = this.props;
        const { schema, map, innerComponent: InnerComponent, props } = this.props;
        if (store) {
            this.lastData = isScope<TStore, any, TState>(schema)
                ? map(schema.getState(store.state), props, store.state)
                : map(schema.getState(store.state), props, store.state) as any;
        }
        return (
            <Provider value={this.selfContext}>
                <InnerComponent {...this.lastData} {...props} />
            </Provider>
        );
    }
    shouldComponentUpdate(props) {
        const { parentContext } = props;
        if ((this.isStoreSubscribe || parentContext) && this.parentContext !== parentContext) {
            this.componentWillUnmount();
            this.componentDidMount();
        }
        return true;
    }
    update = () => {
        const { store } = this.props;
        if (!store) {
            return;
        }
        const { schema, map, props } = this.props;
        const mapped = isScope<TStore, any, TState>(schema)
            ? map(schema.getState(store.state), props, store.state)
            : map(schema.getState(store.state), props, store.state) as any;

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
        if (this.parentContext) {
            this.parentContext.subscribe(this);
        } else {
            const { store } = this.props;
            if (!store) {
                return;
            }
            store.updateHandler.subscribe(this.update);
            this.isStoreSubscribe = true;
        }
    }
    componentWillUnmount() {
        if (this.isStoreSubscribe) {
            const { store } = this.props;
            if (!store) {
                return;
            }
            store.updateHandler.unSubscribe(this.update);
            this.isStoreSubscribe = false;
        } else if (this.parentContext) {
            this.parentContext.unSubscribe(this);
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
    schema: IStoreSchema<TStore, TState>,
    map: MapStateToProps<TState, TStore, Diff<TProps, TMap>, TMap>,
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any)
) {
    return (props: Diff<TProps, TMap>) => (
        <StoreConsumer>
            {store => (
                <Consumer>
                    {context => (
                        <Connector<TStore, TState, TProps, TMap> schema={schema} map={map} store={store} parentContext={context} innerComponent={innerComponent} props={props} />
                    )}
                </Consumer>
            )}
        </StoreConsumer>
    );
}
