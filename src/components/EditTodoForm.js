import React, {useState} from "react";

export const EditTodoForm = ({editTodo, task}) => {
    const [value, setValue] = useState(task.task);
    const [dueDate, setDueDate] = useState(task.dueDate);
    const [priority, setPriority] = useState(task.priority);

    const handleSubmit = e => {
        e.preventDefault();

        editTodo({ task: value, dueDate, priority }, task.id);

        //clears the input after submission
        setValue("");
        setDueDate("");
        setPriority("medium");
    };

    return (
        <form className="TodoForm" onSubmit={handleSubmit}>
            <input
                type="text"
                className="todo-input"
                value={value}
                placeholder="Update task"
                onChange={(e) => setValue(e.target.value)}
            />
            <input
                type="date"
                className="todo-date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
            />
            <select
                className="todo-priority-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
            >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
            </select>
            <button type="submit" className="todo-btn">Update Task</button>
        </form>
    );
};