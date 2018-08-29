"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Subscriber {
    constructor(handler) {
        this.subscriptions = [];
        this.handler = handler;
        this.get = this.get.bind(this);
    }
    get(node, strict = false) {
        let subscribed = false;
        for (const sub of this.subscriptions) {
            if (!sub.node.in(node, strict)) {
                this.subscriptions.push(this.store.subscribe(this.handler, node, strict));
                subscribed = true;
                break;
            }
        }
        if (!subscribed) {
            this.subscriptions.push(this.store.subscribe(this.handler, node, strict));
        }
        return this.store.get(node);
    }
    setStore(store) {
        this.store = store;
    }
    unSubscribeAll() {
        for (const sub of this.subscriptions) {
            sub.unSubscribe();
        }
        this.subscriptions = [];
    }
}
exports.Subscriber = Subscriber;
//# sourceMappingURL=Subscriber.js.map