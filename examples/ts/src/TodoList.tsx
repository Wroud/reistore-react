import * as React from "react";
import { connect } from "reistore-react";
import { Todo } from "./Todo";
import { getVisibleTodos } from "./todoHelpers";

const todoList = ({ todos, filter }) => (
    <ul>
        {getVisibleTodos(todos, filter).map(todo =>
            <Todo key={todo.id} id={todo.id} />
        )}
    </ul>
);


export const TodoList = connect()(todoList);
