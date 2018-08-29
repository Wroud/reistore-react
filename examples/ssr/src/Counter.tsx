import * as React from "react";
import { schema } from "./store";
import { StoreSubscriber } from "reistore-react";

export const Counter = () => {
    return (
        <StoreSubscriber>
            {subscriber => (
                <div>
                    <div>{subscriber.get(schema.counter)}</div>
                    <button onClick={() => subscriber.store.set(schema.counter, v => v + 1)}>
                        Increment
                    </button>
                    <button onClick={() => subscriber.store.set(schema.counter, v => v - 1)}>
                        Decrement
                    </button>
                    <br />
                    <br />
                </div>
            )}
        </StoreSubscriber>
    )
}
