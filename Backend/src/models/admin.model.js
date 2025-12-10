import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { bcryptHash, bcryptHashCompare, generateSalt } from "../utils/customHashingFunction.js";
const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
    const salt = generateSalt();
    const { hash } = await bcryptHash(this.password, salt, 1000);

    this.password = hash;
    this.salt = salt;   
    next();
});

adminSchema.methods.isPassword = async function (password) {
  return await bcryptHashCompare(password, this.password , this.salt, 1000);
};  
adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {   
            _id: this._id,
            email: this.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    );
};

export const Admin = mongoose.model("Admin", adminSchema);
