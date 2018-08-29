import * as React from "react";
import { ISubscriber } from "./interfaces/ISubscriber";
interface IProps<TRoot extends object | any[] | Map<any, any>> {
    children: (value: ISubscriber<TRoot>) => React.ReactNode;
}
export declare class StoreSubscriber<TRoot extends object | any[] | Map<any, any>> extends React.Component<IProps<TRoot>> {
    private subscriber;
    constructor(props: any);
    render(): JSX.Element;
    componentWillUnmount(): void;
}
export {};
