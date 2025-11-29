import { Router } from "express";
import { createSignature , verifyPayment } from "../controller/payment.controller.js";
const paymentRouter = Router();

paymentRouter.route("/generate-signature").post(createSignature);
paymentRouter.route("/verify-payment").post(verifyPayment);
export default paymentRouter;