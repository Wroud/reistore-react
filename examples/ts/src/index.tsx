import * as React from "react";
import { render } from "react-dom";
import { store } from "./store";
import { StoreProvider } from "reistore-react";
import { AddTodo } from "./AddTodo";
import { TodoList } from "./TodoList";
import { Filters } from "./Filters";

const App = () => (
  <StoreProvider value={store}>
    <div className="app">
      <AddTodo />
      <TodoList />
      <Filters />
    </div>
  </StoreProvider>
);

render(<App />, document.getElementById("root"));
