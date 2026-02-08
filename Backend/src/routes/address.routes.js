import { Router } from "express";
import { addAddress , getAddresses , getAddressById , deleteAddress } from "../controller/address.controller.js";
import { verifyJwt } from "../middleware/auth.midlleware.js";

const addressRouter = Router();
addressRouter.post("/add", verifyJwt, addAddress);
addressRouter.get("/getAddress", getAddresses);
addressRouter.get("/getAddress/:id", getAddressById);
addressRouter.delete("/delete/:id", deleteAddress);
export default addressRouter;