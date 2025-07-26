import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';


const app = express();

// CORS middleware
// cors middleware is used to gramt the access request to the 3rd party http request to access the data from external third party server
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

// Serve static files (e.g. for images)
app.use(express.static("public"));

// Cookie parser (can be used before routes)
// cookies ko accept karne aur acceptCookie aur refreshCookie ko use mein lena
app.use(cookieParser());

// 🧠 IMPORTANT:
// Do NOT use express.json() or express.urlencoded() before file-upload routes
// Multer needs access to raw request body for multipart/form-data


// routes import 
import userRouter from './routes/user.routes.js'
import healthcheckRouter from './routes/healthcheck.route.js'
import tweetRouter from './routes/tweet.route.js'
import subscriptionRouter from './routes/subscription.route.js'
import videoRouter from './routes/video.route.js'
import commentRouter from './routes/comment.route.js'
import likeRouter from './routes/like.route.js'
import playlistRouter from './routes/playlist.route.js'
import dashboardRouter from './routes/dashboard.route.js'


// ✅ File-upload routes go first
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter) // e.g., handles /register


// ✅ Use JSON and urlencoded parsers AFTER file-upload routes
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// http://localhost:8000/api/v1/users/register

export { app };
