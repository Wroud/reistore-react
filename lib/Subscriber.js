"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
_a = React.createContext(undefined), exports.SubscribeProvider = _a.Provider, exports.SubscribeConsumer = _a.Consumer;
class Subscriber extends React.Component {
    constructor(props) {
        super(props);
        this.update = (state, updateList) => {
            if (this.isNeedRerender(updateList)) {
                this.forceUpdate();
                return;
            }
            for (const subscriber of this.subscribers) {
                subscriber.update(state, updateList);
            }
        };
        this.subscribe = (connector) => {
            this.subscribers.push(connector);
        };
        this.unSubscribe = (connector) => {
            const id = this.subscribers.indexOf(connector);
            if (id > -1) {
                this.subscribers.splice(id, 1);
            }
        };
        this.subscribers = [];
        this.isStoreSubscribe = false;
        this.provider = props.provider;
        this.selfContext = {
            subscribe: this.subscribe,
            unSubscribe: this.unSubscribe
        };
    }
    render() {
        const { innerComponent: InnerComponent } = this.props;
        return (React.createElement(exports.SubscribeProvider, { value: this.selfContext },
            React.createElement(InnerComponent, Object.assign({}, this.mapProps()))));
    }
    shouldComponentUpdate(props) {
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
        }
        else if (store) {
            store.subscribe(this.update);
            this.isStoreSubscribe = true;
        }
    }
    componentWillUnmount() {
        const { store } = this.props;
        if (this.isStoreSubscribe && store) {
            store.unSubscribe(this.update);
            this.isStoreSubscribe = false;
        }
        else if (this.provider) {
            this.provider.unSubscribe(this);
        }
    }
}
exports.Subscriber = Subscriber;
//# sourceMappingURL=Subscriber.js.map