import mysql from "mysql2/promise";
import 'dotenv/config'

async function setupDB() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.db_host,
      port: process.env.db_port,
      user: process.env.db_user,
      password: process.env.db_password,
    });

    const dbName = process.env.db_name;

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);

    await connection.query(`USE ${dbName}`);

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
        token VARCHAR(500) UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`);

    console.log("Database and Tables created!");

    await connection.end();
  } catch (error) {
    console.log("DB Setup Error:", error.message);
  }
}

setupDB();

// export db_host=localhost db_port=3306 db_user=root db_password=""
// node ./config/db-setup.js
