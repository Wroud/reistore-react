import * as React from "react";
import { path } from "./store";
import { StoreConsumer } from "reistore-react";
import { createTodo } from "./todoHelpers";

interface IProps {
    isEditing: boolean;
    editingId: number;
}

export class TodoForm extends React.Component<IProps> {
    input: string;
    handleUpdate = ({ target: { value } }) => {
        this.input = value.trim();
    }
    render() {
        const { input, handleUpdate } = this;
        const { isEditing } = this.props;
        return (
            <StoreConsumer>
                {store => (
                    <div>
                        <form onSubmit={e => {
                            e.preventDefault();
                            if (!input) {
                                return;
                            }
                            store.add(path.todos, createTodo(input));
                            this.input = "";
                            this.forceUpdate();
                        }}>
                            <input onChange={handleUpdate} />
                            <button type="submit">{isEditing ? "Save" : "Add Todo"}</button>
                        </form>
                    </div>
                )}
            </StoreConsumer>
        )
    };
}
