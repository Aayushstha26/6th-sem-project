import { Router } from "express";
import { addAddress , getAddresses , getAddressById , deleteAddress } from "../controller/address.controller.js";

const addressRouter = Router();
addressRouter.post("/add", addAddress);
addressRouter.get("/getAddress", getAddresses);
addressRouter.get("/getAddress/:id", getAddressById);
addressRouter.delete("/delete/:id", deleteAddress);
export default addressRouter;