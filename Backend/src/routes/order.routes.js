import { Router } from "express";
import { createOrder, getAllOrders, getUserOrders , deleteOrder , updateOrderStatus, getOrderByStatus , getOrderById } from "../controller/order.controller.js";    
import { verifyJwt } from "../middleware/auth.midlleware.js";
import { verifyAdminJwt } from "../middleware/admin_auth.middleware.js";

const orderRouter = Router();

orderRouter.route("/create").post( createOrder);

orderRouter.route("/orders").get( verifyJwt, getUserOrders);
orderRouter.route("/all-orders").get( verifyAdminJwt ,getAllOrders);
orderRouter.route("/delete-order/:id").delete(verifyAdminJwt , deleteOrder);
orderRouter.route("/status/:status").get( verifyJwt, getOrderByStatus);
orderRouter.route("/:id").get( verifyAdminJwt, getOrderById);
orderRouter.route("/update-status/:id").put( verifyAdminJwt, updateOrderStatus);

export default orderRouter;
