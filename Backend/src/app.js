import express from "express";
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import categoryRouter from "./routes/category.routes.js"
import orderRouter from "./routes/order.routes.js"
import cartRouter from "./routes/cart.routes.js"
import pageRouter from "./routes/page.routes.js"
import otpRouter from "./routes/otp.routes.js"
import adminRouter from "./routes/admin.routes.js"
import addressRouter from "./routes/address.routes.js"
import path from "path"
import cookieParser from "cookie-parser"
import { get } from "http";
const app = express();
 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));
app.use(cookieParser())
app.use(express.static(path.resolve("../frontend")));

app.use("/user", userRouter);
app.use("/product", productRouter); 
app.use("/category", categoryRouter);
app.use("/order", orderRouter);
app.use("/", pageRouter);
app.use("/address", addressRouter);
app.use("/admin", adminRouter);
// app.get("/",(req,res)=>{
//     const homepagePath = path.resolve("../frontend/template/Homepage.html");
//     res.sendFile(homepagePath);
// })
app.use("/cart", cartRouter);
app.use("/auth", otpRouter);

export default app;



