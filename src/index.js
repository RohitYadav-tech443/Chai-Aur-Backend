// require('dotenv').config({path: './env/'})
import dotenv from "dotenv"
import connectDB from './db/index.js';
import {app} from './app.js'

dotenv.config({
    path: './.env'
})


// app.listen ya toh mention port pr data ki request send karega na toh 8000 portal par data request send kar dega

connectDB().then( () =>{
    app.listen(process.env.PORT || 8000,() =>{
        console.log(`Server is running at : ${process.env.PORT}`);
    })
})
.catch((err) =>{
    console.log("Mongo db connection failed !!!",err);    
})

/* import express from 'express'
const app=express()

;( async() => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error) =>{
            console.log("Error",error);
            throw error
        })

        app.listen(process.env.PORT,() => {
            console.log(`App is listening on the port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("error:",error);
        throw err
        
    }
})() */