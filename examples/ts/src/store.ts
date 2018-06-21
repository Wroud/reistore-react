import { Store, StoreSchema } from "reistore";

const initState = {
    todos: [],
    filter: 0
};
export const schema = new StoreSchema();
export const store = new Store(schema);