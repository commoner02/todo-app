import mysql from "mysql2/promise";

async function setupDB() {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      port: "3306",
      user: "root",
      password: "",
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS todo_app`)

    await connection.query(`USE todo_app`)

    await connection.query(`CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        password VARCHAR(255)
    )`)

    await connection.query(`CREATE TABLE IF NOT EXISTS todos(
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        todo TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`)

    console.log("Database and Tables created!")

    await connection.end()
    
  } catch (error) {
    console.log(error.message);
  }
}

setupDB()
