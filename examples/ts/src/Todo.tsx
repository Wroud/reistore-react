import * as React from "react";
import { Path } from "reistore";
import { StoreConsumer, connect } from "reistore-react";
import { schema } from "./store";

const todo = ({ index, id, completed, text }) => (
    <StoreConsumer>
        {store => {
            const onClick = () => {
                store.instructor.set(Path.fromSelector(f => f.todos[index].completed), !completed)
            }
            return (
                <li
                    onClick={onClick}
                    style={{
                        textDecoration: completed ? 'line-through' : 'none'
                    }}
                >
                    {text}
                </li>
            );
        }}
    </StoreConsumer>
);

export const Todo = connect(
    schema,
    ({ todos }, props) => ({ ...todos[props.id] }),
    todo
);
