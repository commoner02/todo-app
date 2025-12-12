import express from "express";
import db from "../db.js";

const router = express.Router();

//get todos
router.get("/", async (req, res) => {
  const [todos] = await db.execute("SELECT *FROM todos WHERE user_id = ?", [
    req.userId,
  ]);
  console.log(todos);
  res.json(todos);
});

//create new todo
router.post("/", async (req, res) => {
  const { todo } = req.body;
  const [todos] = await db.execute(
    "INSERT INTO todos (user_id, todo) VALUES (?, ?)",
    [req.userId, todo]
  );
  res.json({ id: todos.insertId, userId: req.userId, todo, completed: 0 });
});

//update a todo
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { todo, completed } = req.body;

  console.log(todo, completed);

  const [todos] = await db.execute(
    "UPDATE todos SET todo = ?, completed = ? WHERE id = ? AND user_id = ?",
    [todo, completed, id, req.userId]
  );

  if (todos.affectedRows === 0) return res.send("todo not found");

  res.json({
    message: "todo updated",
    id: id,
    userId: req.userId,
    todo,
    completed: completed,
  });
});

//delete a todo
router.delete('/:id', async (req, res) => {

  const { id } = req.params;
  const userId = req.userId;

  const [todos] = await db.execute("DELETE FROM todos WHERE id = ? AND user_id = ?", [id, userId]);

  res.json({ message: "todo deleted with id", id: id });

});


export default router;
