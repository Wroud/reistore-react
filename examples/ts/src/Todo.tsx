import * as React from "react";
import { path } from "./store";
import { StoreConsumer, connect } from "reistore-react";

const todo = ({ id, completed, text }) => (
    <StoreConsumer>
        {store => {
            const onClick = () =>
                store.set(path.completed(id), !completed);

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
