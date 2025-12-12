import mysql from "mysql2/promise";
import 'dotenv/config'

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

    (async () => {
      try {
        const connection = await pool.getConnection()
        connection.release()
        console.log("MySQL connected to todo_app db (pool) ")
      } catch (error) {
        console.log(error.message)        
      }
    }) ()

export default pool
