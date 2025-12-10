import { Admin } from "../models/admin.model.js";
import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Apierror("Email and password are required", 400);
  }


  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new Apierror("User not found", 401);
  }
  const isPassword = await admin.isPassword(password);
  if (!isPassword) {
    throw new Apierror("Invalid password", 401);
  }
  const accessToken = admin.generateAccessToken();
  const refreshToken = admin.generateRefreshToken();
  admin.refreshToken = refreshToken;
  await admin.save({ validateBeforeSave: false });
  const Option = {
    httpOnly: true,
    secure: true,
  };
  return res.status(200)
  .cookie("accessToken", accessToken, Option)
  .cookie("refreshToken", refreshToken, Option)
  .json({
    message: "Admin logged in successfully",
    accessToken,
  });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    { new: true }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
   .clearCookie("accessToken", option)
   .clearCookie("refreshToken", option)
    .json({ message: "Admin logged out successfully" });
});


export { loginAdmin , logoutAdmin };
