"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Primitive {
    constructor(store) {
        this.store = store;
    }
    loadState(props) {
        if (this.map) {
            this.state = this.map(this.store.state, props);
        }
        this.props = props;
        return this;
    }
    init(primitive) {
        const prim = new primitive(this.store);
        return prim.loadState;
    }
}
exports.Primitive = Primitive;
//# sourceMappingURL=Primitive.js.map