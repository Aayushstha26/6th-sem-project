import { Router } from "express";
import { loginAdmin, logoutAdmin , getMonthlyOrders } from "../controller/admin.controller.js";
import { verifyAdminJwt } from "../middleware/admin_auth.middleware.js";
const adminRouter = Router();

adminRouter.post("/login", loginAdmin); 
adminRouter.post("/logout", verifyAdminJwt, logoutAdmin);
adminRouter.get("/monthly-orders" , getMonthlyOrders);

export default adminRouter;