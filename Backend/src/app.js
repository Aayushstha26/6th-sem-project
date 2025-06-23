import express from "express";
import userRouter from "./routes/user.routes.js"
import path from "path"
import cookieParser from "cookie-parser"
const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser())
app.use(express.static(path.resolve("../frontend")));

app.use("/user", userRouter)

export default app;



