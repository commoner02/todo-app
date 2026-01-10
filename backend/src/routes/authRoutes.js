import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import db from "../db.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = 7*24*60*60; //7d

const router = express.Router();

const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + REFRESH_TOKEN_EXPIRY);

  await db.execute(
    "INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)",
    [refreshToken, userId, expiresAt]
  );

  return { accessToken, refreshToken };
};

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const [existingUsers] = await db.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const [resultUser] = await db.execute(
      `INSERT INTO users (username, password) VALUES (?,?)`,
      [username, hashedPassword]
    );

    const userId = resultUser.insertId;

    const defaultTodo = `Welcome ${username}! This is your first todo.`;
    await db.execute(`INSERT INTO todos (user_id, todo) VALUES (?,?)`, [
      userId,
      defaultTodo,
    ]);

    const { accessToken, refreshToken } = await generateTokens(userId);

    res.json({
      accessToken,
      refreshToken,
      user: { id: userId, username },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    const [users] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = users[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateTokens(user.id);

    res.json({
      accessToken,
      refreshToken,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const [tokens] = await db.execute(
      "SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()",
      [refreshToken]
    );

    if (tokens.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    const tokenRecord = tokens[0];
    await db.execute("DELETE FROM refresh_tokens WHERE token = ?", [
      refreshToken,
    ]);

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateTokens(tokenRecord.user_id);

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await db.execute("DELETE FROM refresh_tokens WHERE token = ?", [
      refreshToken,
    ]);
  }

  res.json({ message: "Logged out successfully" });
});

export default router;
