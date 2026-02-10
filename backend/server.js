import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

const app = express();
const PORT = process.env.PORT || 5005;

const allowedOrigin =
  process.env.NODE_ENV === "production"
    ? [process.env.CORS_ORIGINS, process.env.FRONTEND_URL].filter(Boolean)
    : ["http://localhost:5173"];

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigin.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

export default app;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
