import {Router} from "express";
import { sendOtp, verifyOtp } from "../controller/otp.controller.js";

const otpRouter = Router();

otpRouter.route("/send").post(sendOtp);
otpRouter.route("/verify").post(verifyOtp); 
export default otpRouter;