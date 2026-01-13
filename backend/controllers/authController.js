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
    //console.log(user);

    const isPasswordValid = await User.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "password not valid" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = await generateRefreshToken(user.id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "logged in successfully" , accessToken });
  } catch (error) {
    res.status(401).json({ message: "not authorized", error: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("refresh api hitted")

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
      maxAge: 15 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "not authorized" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" , error: error.message});
  }
};

const logout = async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken) {
      await Token.delete(refreshToken);
    }
    
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.json({ message: "logged out successfully" });
    
  } catch (error) {
    return res.status(500).json({ message: "server error", error: error.message });
  }
}

export { register, login, refresh, getMe, logout };
