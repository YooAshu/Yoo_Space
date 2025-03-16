import express from "express";
import cors from 'cors'
import cookieParser from "cookie-parser"
// import errorHandler from "./src/middleware/errorHandler.js";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({ extended: true}))

app.use(express.static("public"))

app.use(cookieParser())


// routes

import userRouter from './src/routes/user.route.js'


// routes declaration
app.use('/api/users',userRouter)

app.use((err, req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
    next(err);
  });
// app.use(errorHandler);

export {app}