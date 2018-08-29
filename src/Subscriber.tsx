import {
    IStore,
    INode,
    IAccessorContainer,
    ExtractNodeValue,
    INodeAccessor,
    INodeSubscriber,
    Handler,
    isCountainer,
    PathNode
} from "reistore";
import { ISubscriber } from "./interfaces/ISubscriber";

export class Subscriber<TRoot extends object | any[] | Map<any, any>>
    implements ISubscriber<TRoot>{
    store!: IStore<TRoot>;
    private subscriptions: Map<INodeAccessor<TRoot, any>, INodeSubscriber<TRoot>>;
    private handler: Handler<TRoot>;
    constructor(handler: Handler<TRoot>) {
        this.subscriptions = new Map();
        this.handler = handler;
        this.get = this.get.bind(this);
    }
    get<TNode extends INode<TRoot, any, any, any, any>>(
        node: IAccessorContainer<TRoot, TNode>,
        strict: boolean = false
    ): ExtractNodeValue<TNode> {
        let accessor = node as INodeAccessor<TRoot, TNode>;
        if (isCountainer<TNode>(node)) {
            accessor = node[PathNode] as any;
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
    setStore(store: IStore<TRoot>) {
        this.store = store;
    }
    unSubscribeAll() {
        for (const sub of this.subscriptions) {
            sub["1"].unSubscribe();
        }
        this.subscriptions.clear();
    }
}
