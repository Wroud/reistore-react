"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reistore_1 = require("reistore");
class Subscriber {
    constructor(handler) {
        this.subscriptions = new Map();
        this.handler = handler;
        this.get = this.get.bind(this);
    }
    get(node, strict = false) {
        let accessor = node;
        if (reistore_1.isCountainer(node)) {
            accessor = node[reistore_1.PathNode];
        }
        let subscribed = false;
        for (const sub of this.subscriptions) {
            if (!sub["0"].in(node, strict)) {
                this.subscriptions.set(accessor, this.store.subscribe(this.handler, node, strict));
                subscribed = true;
                break;
            }
        }
        if (!subscribed) {
            this.subscriptions.set(accessor, this.store.subscribe(this.handler, node, strict));
        }
        return this.store.get(node);
    }
    setStore(store) {
        this.store = store;
    }
    unSubscribeAll() {
        for (const sub of this.subscriptions) {
            sub["1"].unSubscribe();
        }
        this.subscriptions.clear();
    }
}
exports.Subscriber = Subscriber;
//# sourceMappingURL=Subscriber.js.map