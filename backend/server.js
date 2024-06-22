const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

mongoose.connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true });

const TodoSchema = new mongoose.Schema({
    task: String,
    dueDate: String,
    priority: String,
    completed: Boolean,
    isEditing: Boolean
});

const Todo = mongoose.model('Todo', TodoSchema);

app.use(cors());
app.use(express.json());

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.send(todos);
});

app.post('/todos', async (req, res) => {
    const todo = new Todo(req.body);
    await todo.save();
    res.send(todo);
});

app.put('/todos/:id', async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(todo);
});

app.delete('/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.send({ message: 'Todo deleted' });
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
