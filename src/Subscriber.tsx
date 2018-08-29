import {
    IStore,
    INode,
    IAccessorContainer,
    ExtractNodeValue,
    INodeSubscriber,
    Handler
} from "reistore";
import { ISubscriber } from "./interfaces/ISubscriber";

export class Subscriber<TRoot extends object | any[] | Map<any, any>>
    implements ISubscriber<TRoot>{
    store!: IStore<TRoot>;
    private subscriptions: INodeSubscriber<TRoot>[];
    private handler: Handler<TRoot>;
    constructor(handler: Handler<TRoot>) {
        this.subscriptions = [];
        this.handler = handler;
        this.get = this.get.bind(this);
    }
    get<TNode extends INode<TRoot, any, any, any, any>>(
        node: IAccessorContainer<TRoot, TNode>,
        strict: boolean = false
    ): ExtractNodeValue<TNode> {
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
    setStore(store: IStore<TRoot>) {
        this.store = store;
    }
    unSubscribeAll() {
        for (const sub of this.subscriptions) {
            sub.unSubscribe();
        }
        this.subscriptions = [];
    }
}
