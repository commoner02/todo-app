import express from "express";
const router = express.Router();
import { register, login, refresh, getMe, logout } from '../controllers/authController.js'
import protect from "../middlewares/authMiddleware.js";

//console.log(router);

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)

router.post("/refresh", refresh);
router.get("/me", protect, getMe);

export default router;
