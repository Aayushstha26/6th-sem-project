import express from "express";
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import path from "path"
import cookieParser from "cookie-parser"
const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(cookieParser())
app.use(express.static(path.resolve("../frontend")));

app.use("/user", userRouter);
app.use("/product", productRouter); 
// app.use("/admin", adminRouter);
app.get("/",(req,res)=>{
    const homepagePath = path.resolve("../frontend/template/Homepage.html");
    res.sendFile(homepagePath);
})

export default app;



