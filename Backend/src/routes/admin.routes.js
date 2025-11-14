import { Router } from "express";
import { loginAdmin } from "../controller/admin.controller.js";
const adminRouter = Router();

adminRouter.post("/login", loginAdmin); 


export default adminRouter;