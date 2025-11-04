import generateOtp from "../utils/generateOtp.js";
import sendOtpToEmail from "../utils/sendEmail.js";
import { Otp } from "../models/otp.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) {
   throw new Apierror(400, "Email is required");
  }
  const otpCode = generateOtp(6);

  const opt =  await Otp.create({
    email,
    otp: otpCode,
  });
  await sendOtpToEmail(email, otpCode);
  res.status(200).json({ message: "OTP sent successfully" });
});
const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;  
    if (!email || !otp) {
    throw new Apierror(400, "Email and OTP are required");
    }
    const record = await Otp.findOne({ email, otp });
    if (!record) {
    throw new Apierror(400, "Invalid OTP or Email");
    }
    await Otp.deleteMany({ email });
    res.status(200).json({ message: "OTP verified successfully" });
});



export { sendOtp , verifyOtp };