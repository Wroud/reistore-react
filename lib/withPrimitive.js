"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const StoreProvider_1 = require("./StoreProvider");
const Subscriber_1 = require("./Subscriber");
;
class PrimitiveConnector extends Subscriber_1.Subscriber {
    constructor() {
        super(...arguments);
        this.mapProps = () => {
            const { store } = this.props;
            const { map, props } = this.props;
            this.initMap = {};
            if (store) {
                Object.keys(map).forEach(key => {
                    const primitive = new map[key](store);
                    primitive.loadState(props);
                    this.initMap[key] = primitive;
                });
            }
            return Object.assign({}, this.initMap, props);
        };
        this.isNeedRerender = () => {
            const { store } = this.props;
            if (!store) {
                return false;
            }
            const { map, props } = this.props;
            const newMap = {};
            const curKeys = Object.keys(this.initMap || {});
            const newKeys = Object.keys(map);
            if (store) {
                newKeys.forEach(key => {
                    const primitive = new map[key](store);
                    primitive.loadState(props);
                    newMap[key] = primitive;
                });
            }
            if (curKeys.length !== newKeys.length
                || curKeys.some(key => this.initMap[key].state
                    !== newMap[key].state)) {
                this.initMap = newMap;
                return true;
            }
            return false;
        };
    }
}
exports.PrimitiveConnector = PrimitiveConnector;
function withPrimitive(map) {
    return (innerComponent) => (props) => (React.createElement(StoreProvider_1.StoreConsumer, null, store => (React.createElement(Subscriber_1.SubscribeConsumer, null, context => (React.createElement(PrimitiveConnector, { map: map, store: store, innerComponent: innerComponent, props: props }))))));
}
exports.withPrimitive = withPrimitive;
//# sourceMappingURL=withPrimitive.js.map