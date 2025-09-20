import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res ,next)=>{
  try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
     throw new Apierror(401,"Unauthorized request");
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  
    const user = await User.findById(decoded?._id).select(-Password -refreshToken);
     if(!user){
     throw new Apierror(401,"Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new Apierror(401, " Invalid or expired token");
  }
})