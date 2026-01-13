import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("DB Connected to:", process.env.db_name);

export default pool;
