import { Router } from "express";
import { createSignature } from "../controller/payment.controller.js";
const paymentRouter = Router();

paymentRouter.route("/generate-signature").post(createSignature);

export default paymentRouter;