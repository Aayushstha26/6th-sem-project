import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { 
     type: mongoose.Schema.Types.ObjectId,
     ref: "User",
  },
  amount: { 
    type: Number,
    required: true
    },
    orderStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],     
        default: "Pending",
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],     
        default: "Pending",
    },
    items: [
        {
            product: {  
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },          
            quantity: {
                type: Number,
                required: true,     
                min: 1,
                default: 1,
            },
            price: {
                type: Number,
                required: true,
            },
        }
    ],
    transactionId  : {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Order = mongoose.model("Order", orderSchema);