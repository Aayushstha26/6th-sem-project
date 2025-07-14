import mongoose, { Schema } from "mongoose";

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
        type: String,
        required: true,
    },
     image_url: {
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