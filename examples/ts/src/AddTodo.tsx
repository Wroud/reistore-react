import * as React from "react";
import { Path } from "reistore";
import { StoreConsumer } from "reistore-react";
import { createTodo } from "./todoHelpers";

export const AddTodo = () => {
    let input;
    return (
        <StoreConsumer>
            {store => (
                <div>
                    <form onSubmit={e => {
                        e.preventDefault();
                        if (!input.value.trim()) {
                            return;
                        }
                        store.instructor.add(Path.fromSelector(f => f.todos), createTodo(input.value));
                        input.value = '';
                    }}>
                        <input ref={node => input = node} />
                        <button type="submit">Add Todo</button>
                    </form>
                </div>
            )}
        </StoreConsumer>
    )
}
