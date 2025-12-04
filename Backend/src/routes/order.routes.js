import { Router } from "express";
import { createOrder, getAllOrders, getUserOrders , deleteOrder , updateOrderStatus, getOrderByStatus , getOrderById } from "../controller/order.controller.js";    
import { verifyJwt } from "../middleware/auth.midlleware.js";

const orderRouter = Router();

orderRouter.route("/create").post( createOrder);

orderRouter.route("/orders").get( verifyJwt, getUserOrders);
orderRouter.route("/all-orders").get( verifyJwt, getAllOrders);
orderRouter.route("/delete-order/:id").delete( verifyJwt, deleteOrder);
orderRouter.route("/status/:status").get( verifyJwt, getOrderByStatus);
orderRouter.route("/:id").get( verifyJwt, getOrderById);
orderRouter.route("/update-status/:id").put( verifyJwt, updateOrderStatus);

export default orderRouter;
