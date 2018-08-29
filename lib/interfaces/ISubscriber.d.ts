import { IStore, INode, IAccessorContainer, ExtractNodeValue } from "reistore";
export interface ISubscriber<TRoot extends object | any[] | Map<any, any>> {
    store: IStore<TRoot>;
    get<TNode extends INode<TRoot, any, any, any, any>>(node: IAccessorContainer<TRoot, TNode>, strict?: boolean): ExtractNodeValue<TNode>;
    setStore(store: IStore<TRoot>): any;
    unSubscribeAll(): any;
}
