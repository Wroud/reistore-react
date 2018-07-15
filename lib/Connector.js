"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const shallowEqual_1 = require("./shallowEqual");
const StoreProvider_1 = require("./StoreProvider");
const Subscriber_1 = require("./Subscriber");
class Connector extends Subscriber_1.Subscriber {
    constructor() {
        super(...arguments);
        this.mapProps = () => {
            const { store } = this.props;
            const { schema, map, props } = this.props;
            if (store) {
                this.lastData = map((schema || store.schema).getState(store), props, store.state);
            }
            return Object.assign({}, this.lastData, props);
        };
        this.isNeedRerender = (changes) => {
            const { store, subscriber } = this.props;
            if (subscriber) {
                return subscriber(changes);
            }
            if (!store) {
                return false;
            }
            const { schema, map, props } = this.props;
            const mapped = map((schema || store.schema).getState(store), props, store.state);
            if (!shallowEqual_1.shallowEqual(this.lastData, mapped)) {
                this.lastData = mapped;
                return true;
            }
            return false;
        };
    }
}
exports.Connector = Connector;
function connect(map = (f => f), schema, subscriber) {
    return (innerComponent) => (props) => (React.createElement(StoreProvider_1.StoreConsumer, null, store => (React.createElement(Subscriber_1.SubscribeConsumer, null, context => (React.createElement(Connector, { schema: schema, map: map, store: store, provider: context, innerComponent: innerComponent, subscriber: subscriber, props: props }))))));
}
exports.connect = connect;
//# sourceMappingURL=Connector.js.map