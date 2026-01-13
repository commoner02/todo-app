import pool from "../config/database.js";

class Todo {
  static async create(userId, todo, completed = false) {
    console.log("Creating todo for user:", userId);
    const [result] = await pool.execute(
      "INSERT INTO todos (user_id, todo, completed) VALUES (?, ?, ?)",
      [userId, todo, completed]
    );
    return result.insertId;
  }

  static async findByUser(userId) {
    const [rows] = await pool.execute(
      "SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );
    return rows;
  }

  static async findById(id, userId) {
console.log("Finding todo by ID for user:", userId);
    const [rows] = await pool.execute(
      "SELECT * FROM todos WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return rows[0];
  }

  static async update(id, userId, data) {
    const { todo, completed } = data;
    const [result] = await pool.execute(
      "UPDATE todos SET todo = ?, completed = ? WHERE id = ? AND user_id = ?",
      [todo, completed, id, userId]
    );
    return result.affectedRows > 0;
  }

  static async delete(id, userId) {
    const [result] = await pool.execute(
      "DELETE FROM todos WHERE id = ? AND user_id = ?",
      [id, userId]
    );
    return result.affectedRows > 0;
  }
}

export default Todo