import express from "express";
import db from "../db.js";

const router = express.Router();

// Get all todos for user
router.get("/", async (req, res) => {
  try {
    const [todos] = await db.execute(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
      [req.userId]
    );
    res.json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Create new todo
router.post("/", async (req, res) => {
  try {
    const { todo } = req.body;
    const [result] = await db.execute(
      "INSERT INTO todos (user_id, todo) VALUES (?, ?)",
      [req.userId, todo]
    );
    
    const [newTodo] = await db.execute(
      "SELECT * FROM todos WHERE id = ?",
      [result.insertId]
    );
    
    res.json(newTodo[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Update a todo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { todo, completed } = req.body;

    const [result] = await db.execute(
      "UPDATE todos SET todo = ?, completed = ? WHERE id = ? AND user_id = ?",
      [todo, completed, id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const [updatedTodo] = await db.execute(
      "SELECT * FROM todos WHERE id = ?",
      [id]
    );
    
    res.json(updatedTodo[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM todos WHERE id = ? AND user_id = ?", 
      [id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted successfully", id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;