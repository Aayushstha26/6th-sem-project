import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";
import { Apiresponse } from "../utils/apiRespone.js";
import jwt from "jsonwebtoken";

const registerUser = asyncHandler(async (req, res) => {
  const { Firstname, Lastname, Phone, Email, Password } = req.body;

  console.log(Firstname);
  if (!Firstname || !Lastname || !Phone || !Email || !Password) {
    throw new Apierror(400, "All field are required");
  }
  const email = Email.toLowerCase();

  const user = await User.create({
    Firstname,
    Lastname,
    Phone,
    Email: email,
    Password,
  });

  const cUser = await User.findById(user._id);
  if (!cUser) {
    console.log("errror");
  }
  return res.status(200).json({
    message: "User register successfully",
  });
});
const loginUser = asyncHandler(async (req, res) => {
  const { Email, Password } = req.body;
  console.log(Email);
  if (!(Email || Password)) {
    throw new Apierror(400, "Email or password is required");
  }
  const user = await User.findOne({ Email });
  if (!user) {
    return res
      .status(400)
      .json({ message: "user not found" }, new Apierror(400, "User not found"));
  }
  const isMatch = await user.isPassword(Password);
  if (!isMatch) {
    return res
      .status(400)
      .json(
        { message: "Password doesn't match" },
        new Apierror(400, "Invalid password")
      );
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json({ accessToken, refreshToken, message: "Login successfull" });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshTokenn", option)
    .json(200, {}, new Apiresponse(200, "User logout"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incommingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incommingRefreshToken) {
    throw new Apierror(401, "Unauthorized request");
  }
  try {
    const decodedRefreshToken = jwt.verify(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedRefreshToken?._id);
    if (!user) {
      throw new Apierror(401, "Invalid refresh token ");
    }
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new Apierror(401, "Refresh token is expired or used ");
    }
    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });
    const option = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", newRefreshToken, option)
      .json({
        accessToken,
        newRefreshToken,
        message: "Access token refreshed",
      });
  } catch (error) {
          throw new Apierror(401, "Invalid refresh token");
  }
});
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res
    .status(200)
    .json(new Apiresponse(200, "Users fetched successfully", users));
});
const changePassword = asyncHandler(async (req, res) => {
  const { password , email} = req.body;

  if (!password) {
    throw new Apierror(400, "Password is required");
  } 
  const user =  await User.findOne({ Email: email });
  if (!user) {
    throw new Apierror(404, "User not found");
  }
  user.Password = password;
  await user.save();
  return res
    .status(200)
    .json(new Apiresponse(200, "Password changed successfully")); 
});
const deleteUser = asyncHandler(async (req, res) => {
  const {id} = req.params;
  if (!id) {
    throw new Apierror(400, "User ID is required");
  }
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Apierror(404, "User not found");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, "User deleted successfully"));
});
const updateUserInfo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { Firstname, Lastname, Phone , Email } = req.body;
  if (!Firstname || !Lastname || !Phone || !Email ) {
    throw new Apierror(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    userId,
    {
      Firstname,
      Lastname,
      Phone,
      Email
    },
    { new: true }
  );
  if (!user) {
    throw new Apierror(404, "User not found");
  } 
  return res
    .status(200)
    .json(new Apiresponse(200, "User info updated successfully", user));
});

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new Apierror(404, "User not found");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, "User fetched successfully", user));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id;
  if (!oldPassword || !newPassword) {
    throw new Apierror(400, "Old password and new password are required");
  }
  if (oldPassword === newPassword) {
    throw new Apierror(400, "New password must be different from old password");
  }
  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new Apierror(404, "User not found");
  }
  const isMatch = await user.isPassword(oldPassword);
  if (!isMatch) {
    throw new Apierror(400, "Old password is incorrect");
  }
  user.Password = newPassword;
  await user.save();
  return res
    .status(200)
    .json(new Apiresponse(200, "Password reset successfully"));
});
export { registerUser, loginUser, logoutUser , refreshAccessToken , getAllUsers , changePassword, resetPassword , deleteUser , updateUserInfo , getUserById};
