import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";
import User from "../models/User.js";
import Todo from "../models/Todo.js";
import Token from "../models/Token.js";

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findByUsername(username);

    if (userExists) {
      return res.status(400).json({ message: "user already exists" });
    }

    const userId = await User.create(username, password);

    if (!userId) {
      return res.status(500).json({ message: "could not create user" });
    }

    const defaultTodo = `Welcome ${username}! This is your first todo.`;
    await Todo.create(userId, defaultTodo, false);

    res.status(201).json({ message: "user registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "username not found" });
    }

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "password not valid" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "logged in successfully",
      user: { id: user.id, username: user.username }, // Return user info
    });
  } catch (error) {
    res.status(401).json({ message: "not authorized", error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("refresh api hitted");

    if (!refreshToken) {
      return res.status(401).json({ message: "no refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const validToken = await Token.isValid(refreshToken);

    if (!validToken) {
      return res.status(401).json({ message: "invalid refresh token" });
    }

    const accessToken = generateAccessToken(decoded.userId);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "not authorized" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const updated = await User.updatePassword(username, newPassword);
    if (updated) {
      await Token.deleteByUserId(user.id);
    }
    if (!updated) {
      return res.status(500).json({ message: "could not update password" });
    }
    res.json({ message: "password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await Token.delete(refreshToken);
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });

    res.json({ message: "logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};
export { register, login, refresh, resetPassword, getMe, logout };
