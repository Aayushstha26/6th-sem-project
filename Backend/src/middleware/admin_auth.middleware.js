import { Admin } from "../models/admin.model.js";
import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const verifyAdminJwt = asyncHandler(async (req, res ,next)=>{
  try {
    const token =  req.cookies?.adminAccessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
        throw new Apierror(401,"Unauthorized request");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    const admin = await Admin.findById(decoded?._id).select("-password");
        if(!admin){
        throw new Apierror(401,"Invalid access token");
    }
    req.admin = admin;
    next();
  } catch (error) {
    throw new Apierror(401, " Invalid or expired token");
  } 
})

export { verifyAdminJwt };