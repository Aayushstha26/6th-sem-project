import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transaction_uuid: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["ESewa", "CashOnDelivery"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
