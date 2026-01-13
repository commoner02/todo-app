import pool from "../config/database.js";
import bcrypt from "bcryptjs";

class User {
  static async create(username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      `INSERT INTO users (username, password ) VALUES ( ?, ?)`,
      [username, hashedPassword]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    return rows[0];
  }

  static async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export default User;
