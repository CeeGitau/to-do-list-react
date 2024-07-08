import React, {useState} from "react";

export const TodoForm = ({addTodo}) => {
    const [value, setValue] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("medium");

    const handleSubmit = e => {
        e.preventDefault();

        addTodo({ task: value, dueDate, priority });

        //clears inputs after submission
        setValue("");
        setDueDate("");
        setPriority("medium"); 
    }

    //Get current date
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return (
        <form className="TodoForm" onSubmit={handleSubmit}>
            <input 
                type="text" 
                className="todo-input" 
                value={value} 
                placeholder="What is the task today?" 
                onChange={(e) => setValue(e.target.value)} 
            />

            <input 
                type="date"
                className="todo-date-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={getCurrentDate()} //Set the minimum date to today
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

            <button type="submit" className="todo-btn">Add Task</button>
        </form>
    )
}