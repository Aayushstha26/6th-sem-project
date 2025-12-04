import { Router } from "express";
import { createOrder, getAllOrders, getUserOrders , deleteOrder } from "../controller/order.controller.js";    
import { verifyJwt } from "../middleware/auth.midlleware.js";

const router = Router();

router.route("/create").post( createOrder);

router.route("/orders").get( verifyJwt, getUserOrders);
router.route("/all-orders").get( verifyJwt, getAllOrders);
router.route("/delete-order/:id").delete( verifyJwt, deleteOrder);

export default router;
