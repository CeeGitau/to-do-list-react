import React, { useState } from 'react';

export const EditTodoForm = ({ editTodo, task }) => {
    const [newTask, setNewTask] = useState(task.task);
    const [newDueDate, setNewDueDate] = useState(task.dueDate);
    const [newPriority, setNewPriority] = useState(task.priority);

    const handleSubmit = e => {
        e.preventDefault();
        editTodo({
            task: newTask,
            dueDate: newDueDate,
            priority: newPriority
        }, task._id);
    };

    return (
        <form onSubmit={handleSubmit} className="EditTodoForm">
            <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                className="todo-input"
            />
            <input 
                type="date" 
                value={newDueDate} 
                onChange={(e) => setNewDueDate(e.target.value)} 
                className="todo-input"
            />
            <select 
                value={newPriority} 
                onChange={(e) => setNewPriority(e.target.value)} 
                className="todo-input"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button type="submit" className="todo-btn">Update</button>
        </form>
    );
};
