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
export const todosPath = Path.fromSelector((f: IStore) => f.todos);
export const filterPath = Path.fromSelector((f: IStore) => f.filter);
export const todoCompletedPath = (id: number) => Path.fromSelector((f: IStore) => f.todos[id].completed);
export const store = createStore<IStore>(undefined, initState);