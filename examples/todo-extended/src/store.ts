import { createStore, Path } from "reistore";

interface ITodo {
    id: number;
    completed: boolean;
    text: string;
}
interface IStore {
    todos: ITodo[];
    filter: number;
}

const initState: IStore = {
    todos: [],
    filter: 0
};
export const path = {
    todos: Path.create((f: IStore) => f.todos["{}"]),
    filter: Path.create((f: IStore) => f.filter),
    completed: Path.create((f: IStore) => f.todos["{}"].completed)
}
export const store = createStore<IStore>(undefined, initState);