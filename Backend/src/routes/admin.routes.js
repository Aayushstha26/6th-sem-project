import { Router } from "express";
import { loginAdmin, logoutAdmin , getMonthlyOrders } from "../controller/admin.controller.js";
const adminRouter = Router();

adminRouter.post("/login", loginAdmin); 
adminRouter.post("/logout", logoutAdmin);
adminRouter.get("/monthly-orders" , getMonthlyOrders);

export default adminRouter;