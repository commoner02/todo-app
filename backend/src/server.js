import express from "express";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import cors from "cors";
import cookieParser from "cookie-parser"
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5005;
const allowedOrigin = process.env.CORS_ORIGINS;

app.use(express.json());

app.use(cookieParser())

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  //console.log('jwt secret loaded:', !!process.env.JWT_SECRET)
});
