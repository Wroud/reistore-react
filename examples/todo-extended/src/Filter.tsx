import * as React from "react";
import { path } from "./store";
import { connect, StoreConsumer } from "reistore-react";

const filter = ({ active, filter, text }) => (
    <StoreConsumer>
        {store => {
            const onClick = () =>
                store.set(path.filter, filter);

            const style = { marginLeft: '4px' };
            return (
                <button
                    onClick={onClick}
                    disabled={active}
                    style={style}
                >
                    {text}
                </button>
            )
        }}
    </StoreConsumer>
);

export const Filter = connect(
    ({ filter }, props) => ({ active: filter === props.filter })
)(filter);