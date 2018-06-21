"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reistore_1 = require("reistore");
const shallowEqual_1 = require("./shallowEqual");
const StoreProvider_1 = require("./StoreProvider");
const { Provider, Consumer } = React.createContext(undefined);
class Connector extends React.Component {
    constructor(props) {
        super(props);
        this.update = () => {
            const { store } = this.props;
            if (!store) {
                return;
            }
            const { schema, map, props } = this.props;
            const mapped = reistore_1.isScope(schema)
                ? map(schema.getState(store.state), props, store.state)
                : map(schema.getState(store.state), props, store.state);
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
            this.lastData = reistore_1.isScope(schema)
                ? map(schema.getState(store.state), props, store.state)
                : map(schema.getState(store.state), props, store.state);
        }
        return (React.createElement(Provider, { value: this.selfContext },
            React.createElement(InnerComponent, Object.assign({}, this.lastData, props))));
    }
    shouldComponentUpdate(props) {
        const { parentContext } = props;
        if ((this.isStoreSubscribe || parentContext) && this.parentContext !== parentContext) {
            this.componentWillUnmount();
            this.componentDidMount();
        }
        return true;
    }
    componentDidMount() {
        if (this.parentContext) {
            this.parentContext.subscribe(this);
        }
        else {
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
        }
        else if (this.parentContext) {
            this.parentContext.unSubscribe(this);
        }
    }
}
exports.Connector = Connector;
function connect(schema, map, innerComponent) {
    return (props) => (React.createElement(StoreProvider_1.StoreConsumer, null, store => (React.createElement(Consumer, null, context => (React.createElement(Connector, { schema: schema, map: map, store: store, parentContext: context, innerComponent: innerComponent, props: props }))))));
}
exports.connect = connect;
//# sourceMappingURL=Connector.js.map