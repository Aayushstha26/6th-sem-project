import { Router } from "express";

import { addToCart, getCart, removeFromCart, getCartCount } from "../controller/cart.controller.js";
import { verifyJwt } from "../middleware/auth.midlleware.js";


const router = Router();
router.post("/add", verifyJwt, addToCart);
router.get("/getCart", verifyJwt, getCart);
router.delete("/remove", verifyJwt, removeFromCart);
router.get("/getCartCount", verifyJwt, getCartCount);
export default router;
