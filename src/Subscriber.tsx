import * as React from "react";
import { Store, IPath, Handler } from "reistore";

export const { Provider: SubscribeProvider, Consumer: SubscribeConsumer } = React.createContext<ISubscribeProvider | undefined>(undefined);
export interface ISubscribeProvider {
    subscribe(subscriber: ISubscriber<any>);
    unSubscribe(subscriber: ISubscriber<any>);
}
export interface ISubscriber<TProps> extends ISubscribeProvider {
    update: Handler<any>;
    isNeedRerender: (updateList: IPath<any, any>[]) => boolean;
    mapProps: () => TProps;
}
export interface ISubscruberProps<TStore, TProps> {
    innerComponent: React.ComponentClass<TProps> | ((props: TProps) => any);
    store?: Store<TStore>;
    provider?: ISubscribeProvider;
}

export abstract class Subscriber<TState, TMappedProps, TProps extends ISubscruberProps<TState, TMappedProps>>
    extends React.Component<TProps>
    implements ISubscriber<TMappedProps>
{
    protected selfContext: ISubscribeProvider;
    protected provider?: ISubscribeProvider;
    protected subscribers: ISubscriber<any>[];
    protected isStoreSubscribe: boolean;
    constructor(props: TProps) {
        super(props);
        this.subscribers = [];
        this.isStoreSubscribe = false;
        this.provider = props.provider;
        this.selfContext = {
            subscribe: this.subscribe,
            unSubscribe: this.unSubscribe
        };
    }
    render() {
        const { innerComponent: InnerComponent } = this.props as ISubscruberProps<TState, TMappedProps>;
        return (
            <SubscribeProvider value={this.selfContext}>
                <InnerComponent {...this.mapProps()} />
            </SubscribeProvider>
        );
    }
    abstract mapProps: () => TMappedProps;
    abstract isNeedRerender: (updateList: IPath<TState, any>[]) => boolean;
    update = (state: TState, updateList: IPath<TState, any>[]) => {
        if (this.isNeedRerender(updateList)) {
            this.forceUpdate();
            return;
        }
        for (const subscriber of this.subscribers) {
            subscriber.update(state, updateList);
        }

    }
    shouldComponentUpdate(props: TProps) {
        const { provider } = props;
        if ((this.isStoreSubscribe || provider) && this.provider !== provider) {
            this.componentWillUnmount();
            this.componentDidMount();
        }
        return true;
    }
    componentDidMount() {
        const { store } = this.props;
        if (this.provider) {
            this.provider.subscribe(this);
        } else if (store) {
            store.subscribe(this.update);
            this.isStoreSubscribe = true;
        }
    }
    componentWillUnmount() {
        const { store } = this.props;
        if (this.isStoreSubscribe && store) {
            store.unSubscribe(this.update);
            this.isStoreSubscribe = false;
        } else if (this.provider) {
            this.provider.unSubscribe(this);
        }
    }
    subscribe = (connector: ISubscriber<any>) => {
        this.subscribers.push(connector);
    }
    unSubscribe = (connector: ISubscriber<any>) => {
        const id = this.subscribers.indexOf(connector);
        if (id > -1) {
            this.subscribers.splice(id, 1);
        }
    }
}
