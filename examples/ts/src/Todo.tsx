import * as React from "react";
import { todoCompletedPath } from "./store";
import { StoreConsumer, connect } from "reistore-react";

const todo = ({ id, completed, text }) => (
    <StoreConsumer>
        {store => {
            const onClick = () =>
                store.set(todoCompletedPath(id), !completed);

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
    ({ todos }, props) => todos[props.id]
)(todo);
