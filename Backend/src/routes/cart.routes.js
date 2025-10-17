import { Router } from "express";

import { addToCart, getCart } from "../controller/cart.controller.js";
import { verifyJwt } from "../middleware/auth.midlleware.js";


const router = Router();
router.post("/add", verifyJwt, addToCart);
router.get("/", verifyJwt, getCart);
router.delete("/remove", verifyJwt, removeFromCart);
export default router;
