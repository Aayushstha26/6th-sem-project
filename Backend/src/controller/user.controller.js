import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";

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
  if (!isMatch)
    return res
      .status(400)
      .json(
        { message: "Password doesn't match" },
        new Apierror(400, "Invalid password")
      );
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
      const option = {
        httpOnly: true,
        secure: true
      }
  return res
    .status(200)
    .cookie("accessToken", accessToken ,option)
    .cookie("refreshToken", refreshToken ,option)
    .json({ accessToken, refreshToken, message: "Login successfull" }) ;
});

export { registerUser, loginUser };
