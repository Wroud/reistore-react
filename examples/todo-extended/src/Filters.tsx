import * as React from "react";
import { Filter } from "./Filter";

export const Filters = () => (
    <div>
        <Filter filter={0} text="All" />
        <Filter filter={2} text="Active" />
        <Filter filter={1} text="Completed" />
    </div>
);
