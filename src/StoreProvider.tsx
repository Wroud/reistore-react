import { Store } from "reistore";
import * as React from "react";

export const { Consumer: StoreConsumer, Provider: StoreProvider } = React.createContext<Store<any> | undefined>(undefined);
