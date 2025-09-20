import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import { bcryptHash, bcryptHashCompare, generateSalt } from "../utils/customHashingFunction.js";

const userSchema = new Schema(
  {
    Firstname: {
      type: String,
      required: true,
    },
    Lastname: {
      type: String,
      required: true,
    },
    Phone: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Salt: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) {
    return next();
  }
    const salt = generateSalt();
  const { hash } = bcryptHash(this.Password, salt, 1000);

  this.Password = hash;
  this.Salt = salt;

  next();
});
userSchema.methods.isPassword = async function (password) {
  return await bcryptHashCompare(password, this.Password , this.Salt, 1000);
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.Firstname,
      email: this.Email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1od",
    }
  );
};

export const User = mongoose.model("User", userSchema);
