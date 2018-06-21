let todosCount = 0;
export function createTodo(text: string) {
    return {
        id: ++todosCount,
        completed: false,
        text
    }
}
export const getVisibleTodos = (todos, filter) => {
    switch (filter) {
        case 0:
            return todos
        case 1:
            return todos.filter(t => t.completed)
        case 2:
            return todos.filter(t => !t.completed)
        default:
            throw new Error('Unknown filter: ' + filter)
    }
}
