import * as React from "react";
import { path } from "./store";
import { StoreConsumer, connect } from "reistore-react";

export const counter = ({counter}) => {
    return (
        <StoreConsumer>
            {store => (
                <div>
                    <div>{counter}</div>
                    <button onClick={() => store.set(path.counter, v => v + 1)}>
                        Increment
                    </button>
                    <button onClick={() => store.set(path.counter, v => v - 1)}>
                        Decrement
                    </button>
                    <br />
                    <br />
                </div>
            )}
        </StoreConsumer>
    )
}
export const Counter = connect(
    ({ counter }) => ({counter})
)(counter);
