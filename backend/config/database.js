import mysql from "mysql2/promise";
import fs from "fs";

const caCert = fs.readFileSync("./config/ca.pem");

const pool = mysql.createPool({
  host: process.env.db_host,
  port: process.env.db_port,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, 
  ssl: {
    ca: caCert
  }
});

console.log("DB Connected to:", process.env.db_name);
//console.log(process.cwd());

export default pool;
