import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
// 
const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
// above line is used to make the files public and available to all 
app.use(cookieParser())


// routes import
import userRouter from './routes/user.routes.js'
// routes declaration
app.use("/api/v1/users",userRouter)
// here the "/users" is the prefix

// http://localhost:8000/api/v1/users/register

export {app} 