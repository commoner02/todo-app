import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  if (!username || !password) {
    return res.json("username or password required");
  }

  try {
    const [resultUser] = await db.execute(
      `INSERT INTO users (username, password) VALUES (?,?)`,
      [username, hashedPassword]
    );

    console.log("user inserted");

    const userId = resultUser.insertId;

    const defaultTodo = `Hello! This is your first todo.`;

    await db.execute(`INSERT INTO todos (user_id, todo) VALUES (?,?)`, [
      resultUser.insertId,
      defaultTodo,
    ]);

    console.log("default todo inserted");

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password)

  if (!username || !password) {
    return res.json("username or password required");
  }

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) res.send("user not found");

    const user = users[0];

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      res.send("invalid password");
    }

    console.log("login successfull");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({ token });
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
