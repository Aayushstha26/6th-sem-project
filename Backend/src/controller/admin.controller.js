import { Admin } from "../models/admin.model.js";
import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw new Apierror("User not found", 401);
  }
  const isPassword = await admin.isPassword(password);
  if (!isPassword) {
    throw new Apierror("Invalid password", 401);
  }
  const accessToken = admin.generateAccessToken();
  const Option = {
    httpOnly: true,
    secure: true,
  };
  res.status(200)
  .setCookie("accessToken", accessToken, Option)
  .json({
    message: "Admin logged in successfully",
    accessToken,
  });
});

export { loginAdmin };
