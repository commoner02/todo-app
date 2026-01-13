import pool from "../config/database.js"

class Token {
  static async create(userId, token, expiresAt) {
    const [result] = await pool.execute(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt]
    );
    return result.insertId;
  }

  static async deleteExpired() {
    const [result] = await pool.execute(
      'DELETE FROM refresh_tokens WHERE expires_at <= NOW()'
    );
    return result.affectedRows > 0;
  }

  static async delete(token) {
    const [result] = await pool.execute(
      'DELETE FROM refresh_tokens WHERE token = ?',
      [token]
    );
    return result.affectedRows > 0;
  }

  static async isValid(token) {
    const [rows] = await pool.execute(
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    return rows.length > 0;
  }
}

export default Token