import * as React from "react";
import { connect } from "reistore-react";
import { schema } from "./store";
import { Todo } from "./Todo";
import { getVisibleTodos } from "./todoHelpers";

const todoList = ({ todos }) => (
    <ul>
        {todos.map(todo =>
            <Todo
                key={todo.id}
                {...todo}
            />
        )}
    </ul>
);


export const TodoList = connect(
    schema,
    ({ todos, filter }) => ({ todos: getVisibleTodos(todos, filter) }),
    todoList
);
