import { IStore, INode, IAccessorContainer, ExtractNodeValue, Handler } from "reistore";
import { ISubscriber } from "./interfaces/ISubscriber";
export declare class Subscriber<TRoot extends object | any[] | Map<any, any>> implements ISubscriber<TRoot> {
    store: IStore<TRoot>;
    private subscriptions;
    private handler;
    constructor(handler: Handler<TRoot>);
    get<TNode extends INode<TRoot, any, any, any, any>>(node: IAccessorContainer<TRoot, TNode>, strict?: boolean): ExtractNodeValue<TNode>;
    setStore(store: IStore<TRoot>): void;
    unSubscribeAll(): void;
}
