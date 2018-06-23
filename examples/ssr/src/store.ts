import { createStore, Path } from "reistore";

interface IStore {
    counter: number;
}

const initState: IStore = {
    counter: 0
};
export const path = {
    counter: Path.fromSelector((f: IStore) => f.counter)
}
export const store = () => createStore<IStore>(undefined, initState);