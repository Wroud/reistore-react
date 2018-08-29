import * as React from "react";
import { StateProvider } from "reistore-react";
import { Todo } from "./Todo";
import { getVisibleTodos } from "./todoHelpers";
import { schema } from "./store";

export const TodoList = () => (
    <StateProvider>
        {subscriber => {
            let filter = subscriber.get(schema.filter);
            let todos = subscriber.get(schema.todos, true);
            return (
                <ul>
                    {getVisibleTodos(todos, filter).map(todo =>
                        <Todo key={todo.id} id={todo.id} />
                    )}
                </ul>
            );
        }}
    </StateProvider>
);
