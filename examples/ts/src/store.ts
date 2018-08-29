import { createStore, buildSchema } from "reistore";

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
export const { schema } = buildSchema<IStore>()
    .field("filter")
    .array("todos", b => b
        .field("id")
        .field("text")
        .field("completed")
    );
export const store = createStore<IStore>(initState);