import * as React from "react";
import { Path } from "reistore";
import { connect, StoreConsumer } from "reistore-react";
import { schema } from "./store";

const filter = ({ active, filter, text }) => (
    <StoreConsumer>
        {store => {
            const onClick = () => {
                store.instructor.set(
                    Path.fromSelector(f => f.filter),
                    filter
                );
            }
            return (
                <button
                    onClick={onClick}
                    disabled={active}
                    style={{
                        marginLeft: '4px',
                    }}
                >
                    {text}
                </button>
            )
        }}
    </StoreConsumer>
);


export const Filter = connect(
    schema,
    ({ filter }, props) => ({ active: filter === props.filter }),
    filter
);