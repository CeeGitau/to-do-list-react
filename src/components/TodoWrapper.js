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
            const res = await axios.get('http://localhost:5000/todos');
            setTodos(res.data);
        };
        fetchTodos();
    }, []);

    const addTodo = async ({ task, dueDate, priority }) => {
        const res = await axios.post('http://localhost:5000/todos', {
            task,
            dueDate,
            priority,
            completed: false,
            isEditing: false
        });
        setTodos([...todos, res.data]);
    };

    const toggleComplete = async id => {
        const todo = todos.find(todo => todo.id === id);
        const res = await axios.put(`http://localhost:5000/todos/${id}`, { ...todo, completed: !todo.completed });
        setTodos(todos.map(todo => todo.id === id ? res.data : todo));
    };

    const deleteTodo = async id => {
        await axios.delete(`http://localhost:5000/todos/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const editTodo = id => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo));
    };

    const editTask = async (task, id) => {
        const res = await axios.put(`http://localhost:5000/todos/${id}`, { ...task, isEditing: false });
        setTodos(todos.map(todo => todo.id === id ? res.data : todo));
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
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                    />
                )
            ))}
        </div>
    );
};
