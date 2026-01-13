import Todo from "../models/Todo.js";

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.findByUser(req.userId);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const { todo, completed } = req.body;
    if (!todo) {
      return res.status(400).json({ message: "insert a todo" });
    }

    const todoId = await Todo.create(req.userId, todo, completed);
    const todo_ = await Todo.findById(todoId, req.userId);
    res.status(201).json(todo_);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { todo, completed } = req.body;

    const success = await Todo.update(id, req.userId, { todo, completed });

    if (!success) {
      return res.status(404).json({ message: "Todo not found" });
    }

    const todo_ = await Todo.findById(id, req.userId);
    res.json(todo_);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Todo.delete(id, req.userId);

    if (!success) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getTodos, createTodo, updateTodo, deleteTodo };
