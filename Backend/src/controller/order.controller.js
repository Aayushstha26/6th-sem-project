import { Order } from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import {Apierror} from "../utils/apiError.js";
import { Apiresponse } from "../utils/apiRespone.js";
const createOrder = asyncHandler( async (req, res) => {
    const { userId, items , amount , paymentStatus } = req.body;
    if (!userId || !items ||  !amount) {
    throw new apiError(400, "All fields are required");
    }
    if(paymentStatus !== "Success"){
        throw new apiError(400, "Payment not successful");
    }
    if(items.length === 0){
        throw new apiError(400, "No items in the order");
    }
   const  order = await Order.create({
        user: userId,
        items,    
        amount,
        status: "Pending",
    });
    return res.status(201).json(new Apiresponse(201, "Order created successfully", order));
})

export { createOrder };