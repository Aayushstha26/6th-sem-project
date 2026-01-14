import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateHash } from "../utils/crypto.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Payment } from "../models/payment.model.js";
const createSignature = asyncHandler(async (req, res) => {
  const { total_amount, transaction_uuid, product_code } = req.body;
  console.log("Generating signature for:", {
    total_amount,
    transaction_uuid,
    product_code,
  });
  if (!total_amount || !transaction_uuid || !product_code) {
    throw new Apierror(400, "Missing required fields");
  }
  const signature = generateHash(transaction_uuid, total_amount, product_code);
  if (!signature) {
    throw new Apierror(500, "Failed to generate signature");
  }
  return res.status(200).json({
    success: true,
    signature,
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { total_amount, transaction_uuid, product_code, signature } = req.body;
  console.log("Payment verification request:", req.body);

  if (!total_amount || !transaction_uuid || !product_code) {
    throw new Apierror(400, "Missing required fields");
  }

  const userId = req.user._id;

  // eSewa verification URL - using GET method as per eSewa docs
  const verifyUrl = `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${product_code}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`;

  try {
    // eSewa expects a GET request, not POST
    const response = await fetch(verifyUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log response status for debugging
    console.log("eSewa API Response Status:", response.status);

    // Get response text first to debug
    const responseText = await response.text();
    console.log("eSewa API Response:", responseText);

    if (!response.ok) {
      throw new Apierror(400, `Payment verification failed: ${responseText}`);
    }

    // Parse JSON
    const data = JSON.parse(responseText);
    console.log("eSewa verification data:", data);

    // Check payment status
    if (data.status !== "COMPLETE") {
      throw new Apierror(400, `Payment not successful. Status: ${data.status}`);
    }

    // Verify amounts match
    if (parseFloat(data.total_amount) !== parseFloat(total_amount)) {
      throw new Apierror(400, "Amount mismatch with eSewa response");
    }
  } catch (error) {
    Payment.create({
      userId,
      transaction_uuid,
      amount: total_amount,
      paymentMethod: "ESewa",
      status: "Failed",
    });
    console.error("eSewa verification error:", error);
    if (error instanceof Apierror) {
      throw error;
    }
    throw new Apierror(500, `Payment verification failed: ${error.message}`);
  }

  // Get user's cart
  const cart = await Cart.findOne({ userId }).populate(
    "products.productId",
    "product_name price stock"
  );

  if (!cart || cart.products.length === 0) {
    throw new Apierror(400, "Cart is empty");
  }

  // Calculate total amount
  let calculatedAmount = 0;
  cart.products.forEach((item) => {
    calculatedAmount += item.productId.price * item.quantity;
  });

  // Compare amounts (using parseFloat for decimal comparison)
  if (
    parseFloat(calculatedAmount).toFixed(2) !==
    parseFloat(total_amount).toFixed(2)
  ) {
    throw new Apierror(
      400,
      `Amount mismatch. Expected: ${calculatedAmount}, Received: ${total_amount}`
    );
  }

  // Record payment
  const paymentRecord = await Payment.create({
    userId,
    transaction_uuid,
    amount: total_amount,
    paymentMethod: "ESewa",
    status: "Success",
    paidAt: new Date(),
  });

  // Create order
  const order = await Order.create({
    user: userId,
    items: cart.products.map((item) => ({
      product: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    })),
    amount: calculatedAmount,
    orderStatus: "Pending",
    paymentStatus: "Paid",
    transactionId: transaction_uuid,
    payment : paymentRecord._id,
  });

  if (!order) {
    throw new Apierror(500, "Failed to create order");
  }
   paymentRecord.orderId = order._id;
  await paymentRecord.save();
  
  // Update product stock
  for (let item of cart.products) {
    const product = item.productId;
    product.stock -= item.quantity;
    await product.save();
  }

  // Clear cart
  cart.products = [];
  cart.totalAmount = 0;
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Payment verified and order created successfully",
    order,
  });
});

export { createSignature, verifyPayment };
