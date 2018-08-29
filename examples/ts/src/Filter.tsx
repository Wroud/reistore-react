import * as React from "react";
import { schema } from "./store";
import { StoreProvider } from "reistore-react";

export const Filter = ({ filter, text }) => (
    <StoreProvider>
        {subscriber => {
            const onClick = () =>
                subscriber.store.set(schema.filter, filter);

            const style = { marginLeft: '4px' };
            return (
                <button
                    onClick={onClick}
                    disabled={filter === subscriber.get(schema.filter)}
                    style={style}
                >
                    {text}
                </button>
            )
        }}
    </StoreProvider>
);
