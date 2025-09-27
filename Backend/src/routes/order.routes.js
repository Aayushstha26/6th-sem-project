import { Router } from "express";
import { createOrder } from "../controller/order.controller.js";    
import { verifyJwt } from "../middleware/auth.midlleware.js";

const router = Router();

router.route("/create").post( createOrder);

export default router;
