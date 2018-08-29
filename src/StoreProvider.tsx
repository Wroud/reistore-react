import { IStore } from "reistore";
import * as React from "react";

export const {
    Consumer: StoreConsumer,
    Provider: StoreProvider
} = React.createContext<IStore<any> | undefined>(undefined);
