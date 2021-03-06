import * as React from "react";
import { schema } from "./store";
import { StoreSubscriber } from "reistore-react";

export const Todo = ({ id }) => (
    <StoreSubscriber>
        {subscriber => {
            const { completed, text } = subscriber.get(schema.todos(id));
            const onClick = () =>
                subscriber.store.set(schema.todos(id, t => t.completed), !completed);

            const style = {
                textDecoration: completed ? 'line-through' : 'none'
            };
            return (
                <li onClick={onClick} style={style}>
                    {text}
                </li>
            );
        }}
    </StoreSubscriber>
);
