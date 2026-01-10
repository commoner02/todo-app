import mysql from "mysql2/promise";

async function setupDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.db_host,
      port: process.env.db_port,
      user: process.env.db_user,
      password: process.env.db_password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS todo_app_2`);

    await connection.query(`USE todo_app_2`);

    await connection.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        password VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS todos(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        todo TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    await connection.query(`CREATE TABLE IF NOT EXISTS refresh_tokens(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        token VARCHAR(5000) UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    console.log("Database and Tables created!");

    await connection.end();
  } catch (error) {
    console.log(error.message);
  }
}

setupDB();
