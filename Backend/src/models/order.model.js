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
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered", "Cancelled"],     
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
        }
    ]
});
export const Order = mongoose.model("Order", orderSchema);