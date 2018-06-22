import * as React from "react";
import { filterPath } from "./store";
import { connect, StoreConsumer } from "reistore-react";

const filter = ({ active, filter, text }) => (
    <StoreConsumer>
        {store => {
            const onClick = () =>
                store.set(filterPath, filter);

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