import * as React from "react";
import { Filter } from "./Filter";

export const Filters = () => (
    <div>
        <Filter filter={0}>All</Filter>
        <Filter filter={2}>Active</Filter>
        <Filter filter={1}>Completed</Filter>
    </div>
);
