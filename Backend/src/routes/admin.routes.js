import { Router } from "express";
import { loginAdmin, logoutAdmin } from "../controller/admin.controller.js";
const adminRouter = Router();

adminRouter.post("/login", loginAdmin); 
adminRouter.post("/logout", logoutAdmin);

export default adminRouter;