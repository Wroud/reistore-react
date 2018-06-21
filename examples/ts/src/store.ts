import { Store, StoreSchema } from "reistore";

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
export const schema = new StoreSchema<IStore, IStore>();
export const store = new Store<IStore>(schema, initState);