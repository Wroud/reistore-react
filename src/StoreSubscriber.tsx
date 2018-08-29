import * as React from "react";
import { StoreConsumer } from "./StoreProvider";
import { Subscriber } from "./Subscriber";
import { ISubscriber } from "./interfaces/ISubscriber";

interface IProps<TRoot extends object | any[] | Map<any, any>> {
    children: (value: ISubscriber<TRoot>) => React.ReactNode;
}

export class StoreSubscriber<TRoot extends object | any[] | Map<any, any>>
    extends React.Component<IProps<TRoot>> {
    private subscriber: ISubscriber<TRoot>;
    constructor(props) {
        super(props);
        this.subscriber = new Subscriber(() => this.forceUpdate());
    }
    render() {
        return (
            <StoreConsumer>
                {store => {
                    if (store === undefined) {
                        return undefined;
                    }
                    this.subscriber.setStore(store);
                    this.subscriber.unSubscribeAll();
                    return this.props.children(this.subscriber);
                }}
            </StoreConsumer>
        );
    }

    componentWillUnmount() {
        this.subscriber.unSubscribeAll();
    }
}
