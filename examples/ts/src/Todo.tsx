import * as React from "react";
import { todoCompletedPath } from "./store";
import { StoreConsumer, connect } from "reistore-react";
import { schema } from "./store";

const todo = ({ id, completed, text }) => (
    <StoreConsumer>
        {store => {
            const onClick = () =>
                store.instructor.set(todoCompletedPath(id), !completed);

            const style = {
                textDecoration: completed ? 'line-through' : 'none'
            };
            return (
                <li onClick={onClick} style={style}>
                    {text}
                </li>
            );
        }}
    </StoreConsumer>
);

export const Todo = connect(
    schema,
    ({ todos }, props) => todos[props.id]
)(todo);
