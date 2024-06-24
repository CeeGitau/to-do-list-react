import React, { useState, useEffect } from "react";
import { TodoForm } from "./TodoForm";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
import axios from 'axios';

export const TodoWrapper = () => {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState("all");
    const [sort, setSort] = useState("none");

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await axios.get('/todos');
                setTodos(res.data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };
        fetchTodos();
    }, []);

    const addTodo = async ({ task, dueDate, priority }) => {
        try {
            const res = await axios.post('/todos', {
                task,
                dueDate,
                priority,
                completed: false,
                isEditing: false
            });
            setTodos([...todos, res.data]);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleComplete = async _id => {
        try {
            const todo = todos.find(todo => todo._id === _id);
            const res = await axios.put(`/todos/${_id}`, { ...todo, completed: !todo.completed });
            setTodos(todos.map(todo => todo._id === _id ? res.data : todo));
        } catch (error) {
            console.error('Error toggling complete:', error);
        }
    };

    const deleteTodo = async _id => {
        try {
            await axios.delete(`/todos/${_id}`);
            setTodos(todos.filter(todo => todo._id !== _id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const editTodo = _id => {
        setTodos(todos.map(todo => todo._id === _id ? { ...todo, isEditing: !todo.isEditing } : todo));
    };

    const editTask = async (task, _id) => {
        try {
            const res = await axios.put(`/todos/${_id}`, { ...task, isEditing: false });
            setTodos(todos.map(todo => todo._id === _id ? res.data : todo));
        } catch (error) {
            console.error('Error editing task:', error);
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === "completed") return todo.completed;
        if (filter === "incomplete") return !todo.completed;
        return true;
    });

    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sort === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
        if (sort === "priority") {
            const priorities = { high: 1, medium: 2, low: 3 };
            return priorities[a.priority] - priorities[b.priority];
        }
        return 0;
    });

    return (
        <div className="TodoWrapper">
            <h1>Get Things Done!</h1>
            <TodoForm addTodo={addTodo} />
            <div className="filters">
                <button onClick={() => setFilter("all")}>All</button>
                <button onClick={() => setFilter("completed")}>Completed</button>
                <button onClick={() => setFilter("incomplete")}>Incomplete</button>
                <select onChange={(e) => setSort(e.target.value)}>
                    <option value="none">Sort By</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                </select>
            </div>
            {sortedTodos.map((todo, index) => (
                todo.isEditing ? (
                    <EditTodoForm editTodo={editTask} task={todo} key={index} />
                ) : (
                    <Todo
                        task={todo}
                        key={index}
                        toggleComplete={() => toggleComplete(todo._id)}
                        deleteTodo={() => deleteTodo(todo._id)}
                        editTodo={() => editTodo(todo._id)}
                    />
                )
            ))}
        </div>
    );
};
