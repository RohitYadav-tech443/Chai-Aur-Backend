import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes import
import userRouter from './routes/user.routes.js';

const app = express();

// CORS middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// Serve static files (e.g. for images)
app.use(express.static("public"));

// Cookie parser (can be used before routes)
app.use(cookieParser());

// 🧠 IMPORTANT:
// Do NOT use express.json() or express.urlencoded() before file-upload routes
// Multer needs access to raw request body for multipart/form-data

// ✅ File-upload routes go first
app.use("/api/user", userRouter); // e.g., handles /register

// ✅ Use JSON and urlencoded parsers AFTER file-upload routes
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

export { app };
