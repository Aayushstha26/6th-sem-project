import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

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
    refreshToken : {
      type: String
    }
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next){
  if(!this.isModified("Password")){
    return next()
  }
  this.Password = await bcrypt.hash(this.Password, 10);
  next();
})
userSchema.methods.isPassword = async function (password){
  return await bcrypt.compare(password,this.Password)
}
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.Firstname,
      email: this.Email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
     
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "1od",
    }
  );
};

export const User = mongoose.model("User", userSchema);
