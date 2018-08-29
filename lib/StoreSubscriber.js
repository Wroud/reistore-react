"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const StoreProvider_1 = require("./StoreProvider");
const Subscriber_1 = require("./Subscriber");
class StoreSubscriber extends React.Component {
    constructor(props) {
        super(props);
        this.subscriber = new Subscriber_1.Subscriber(() => this.forceUpdate());
    }
    render() {
        return (React.createElement(StoreProvider_1.StoreConsumer, null, store => {
            if (store === undefined) {
                return undefined;
            }
            this.subscriber.setStore(store);
            this.subscriber.unSubscribeAll();
            return this.props.children(this.subscriber);
        }));
    }
    componentWillUnmount() {
        this.subscriber.unSubscribeAll();
    }
}
exports.StoreSubscriber = StoreSubscriber;
//# sourceMappingURL=StoreSubscriber.js.map