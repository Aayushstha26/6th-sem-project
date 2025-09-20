import mongoose, { Mongoose, Schema } from "mongoose";
import { ref } from "process";

const productSchema = new Schema({
    product_name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",     
    },
     productImg: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
},{
    timestamps: true
});

export const Product = mongoose.model("Product", productSchema);