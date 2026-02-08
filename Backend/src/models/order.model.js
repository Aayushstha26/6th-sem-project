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
        enum: ["Pending", "Delivered", "Cancelled"],     
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
                required: true,
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
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null,
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        email: { type: String, required: true },
    },
    savedAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
export const Order = mongoose.model("Order", orderSchema);