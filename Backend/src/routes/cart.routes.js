import { Router } from "express";

import { addToCart } from "../controller/cart.controller.js";
import { verifyJwt } from "../middleware/auth.midlleware.js";

const router = Router();
router.post("/add", verifyJwt, addToCart);

export default router;
