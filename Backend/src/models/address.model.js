import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,      
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});
export const Address = mongoose.model("Address", addressSchema);