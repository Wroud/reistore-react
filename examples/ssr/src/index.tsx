import * as React from "react";
import { render } from "react-dom";
import { store } from "./store";
import { Counter } from "./Counter";
import { StoreProvider } from "reistore-react";

const renderInstance = (id) => {
  const App = () => (
    <StoreProvider value={store()}>
      <div className="app">
        <Counter />
      </div>
    </StoreProvider>
  );

  render(<App />, document.getElementById("root" + id));
};

renderInstance(0);
renderInstance(1);
