import { createStore, buildSchema } from "reistore";

interface IStore {
    counter: number;
}

export const { schema } = buildSchema<IStore>()
    .field("counter", () => 0 as number);
export const store = () => createStore<IStore>();