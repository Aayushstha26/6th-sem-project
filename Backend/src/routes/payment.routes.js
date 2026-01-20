import { Router } from "express";
import {
  createCODPayment,
  createSignature,
  verifyPayment,
} from "../controller/payment.controller.js";
import { verifyJwt } from "../middleware/auth.midlleware.js";
const paymentRouter = Router();

paymentRouter.route("/generate-signature").post(createSignature);
paymentRouter.route("/verify-payment").post(verifyJwt, verifyPayment);
paymentRouter.route("/cod-payment").post(verifyJwt, createCODPayment);
export default paymentRouter;
