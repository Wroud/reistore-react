"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reistore_1 = require("reistore");
const shallowEqual_1 = require("./shallowEqual");
const StoreProvider_1 = require("./StoreProvider");
_a = React.createContext(undefined), exports.Provider = _a.Provider, exports.Consumer = _a.Consumer;
class Connector extends React.Component {
    constructor(props) {
        super(props);
        this.update = () => {
            if (!this.store) {
                return;
            }
            const { schema, map, props } = this.props;
            const mapped = reistore_1.isScope(schema)
                ? map(schema.getState(this.store.state), props, this.store.state)
                : map(schema.getState(this.store.state), props, this.store.state);
            if (!shallowEqual_1.shallowEqual(this.lastData, mapped)) {
                this.lastData = mapped;
                this.forceUpdate();
            }
            else {
                for (const connector of this.connectors) {
                    connector.update();
                }
            }
        };
        this.subscribe = (connector) => {
            this.connectors.push(connector);
        };
        this.unSubscribe = (connector) => {
            const id = this.connectors.indexOf(connector);
            if (id > -1) {
                this.connectors.splice(id, 1);
            }
        };
        this.connectors = [];
        this.isNeedRemount = false;
        this.isStoreSubscribe = false;
        this.selfContext = {
            subscribe: this.subscribe,
            unSubscribe: this.unSubscribe
        };
    }
    render() {
        return (React.createElement(StoreProvider_1.StoreConsumer, null, store => (React.createElement(exports.Consumer, null, context => {
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
            const { schema, map, component: Component, props, children } = this.props;
            if (store) {
                this.lastData = reistore_1.isScope(schema)
                    ? map(schema.getState(store.state), props, store.state)
                    : map(schema.getState(store.state), props, store.state);
            }
            return (React.createElement(exports.Provider, { value: this.selfContext },
                React.createElement(Component, Object.assign({}, this.lastData, props, { children: children }))));
        }))));
    }
    componentDidMount() {
        if (this.connectorContext) {
            this.connectorContext.subscribe(this);
        }
        else {
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
        }
        else if (this.connectorContext) {
            this.connectorContext.unSubscribe(this);
        }
    }
}
exports.Connector = Connector;
function connect(store, map, component) {
    return (props) => (React.createElement(Connector, { schema: store, map: map, component: component, props: props }));
}
exports.connect = connect;
//# sourceMappingURL=Connector.js.map