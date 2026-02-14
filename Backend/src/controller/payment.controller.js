import mongoose from "mongoose";
import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateHash } from "../utils/crypto.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { User } from "../models/user.model.js";
import { sendOrderConfirmationEmail } from "../utils/sendEmail.js";
import { Payment } from "../models/payment.model.js";
import { Product } from "../models/product.model.js";
import { Address } from "../models/address.model.js";
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

  // RECORD PAYMENT
  const paymentRecord = await Payment.create({
    userId,
    transaction_uuid,
    amount: total_amount,
    paymentMethod: "ESewa",
    status: "Success",
    paidAt: new Date(),
  });

  let itemsToOrder = [];
  let calculatedAmount = 0;

  const { isBuyNow, buyNowItem } = req.body;

  if (isBuyNow && buyNowItem) {
    // Handle Buy Now Order
    const product = await Product.findById(buyNowItem.productId);
    if (!product) {
      throw new Apierror(404, "Product not found");
    }
    if (product.stock < buyNowItem.quantity) {
      throw new Apierror(400, `Insufficient stock for ${product.product_name}`);
    }

    calculatedAmount = product.price * buyNowItem.quantity;
    itemsToOrder.push({
      product: product._id,
      quantity: buyNowItem.quantity,
      price: product.price,
    });

    // Update product stock
    product.stock -= buyNowItem.quantity;
    await product.save();
  } else {
    // Handle Cart Order
    const cart = await Cart.findOne({ userId }).populate(
      "products.productId",
      "product_name price stock",
    );

    if (!cart || cart.products.length === 0) {
      throw new Apierror(400, "Cart is empty");
    }

    cart.products.forEach((item) => {
      calculatedAmount += item.productId.price * item.quantity;
      itemsToOrder.push({
        product: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      });
    });

    // Update product stock and clear cart
    for (let item of cart.products) {
      const product = item.productId;
      product.stock -= item.quantity;
      await product.save();
    }

    // Clear cart
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();
  }

  // Validate amount matches
  if (
    parseFloat(calculatedAmount).toFixed(2) !==
    parseFloat(total_amount).toFixed(2)
  ) {
    // Note: If this fails, we've already deducted stock.
    // In a production app, we'd use a transaction here.
    throw new Apierror(
      400,
      `Amount mismatch. Expected: ${calculatedAmount}, Received: ${total_amount}`,
    );
  }

  // CREATE ORDER

  const savedAddr = await Address.findOne({ userId });
  if (!savedAddr) {
    throw new Apierror(400, "No address found for user");
  }
   let shippingAddress = {
      fullName: savedAddr.fullName,
      phoneNumber: savedAddr.phoneNumber,
      address: savedAddr.address,
      city: savedAddr.city,
      postalCode: savedAddr.postalCode,
      email: savedAddr.email,
    };

  const order = await Order.create({
    user: userId,
    shippingAddress,
    savedAddress: savedAddr._id,
    items: itemsToOrder,
    amount: calculatedAmount,
    orderStatus: "Pending",
    paymentStatus: "Paid",
    transactionId: transaction_uuid,
    payment: paymentRecord._id,
  });

  if (!order) {
    throw new Apierror(500, "Failed to create order");
  }

  paymentRecord.orderId = order._id;
  await paymentRecord.save();
 // After creating the order, prepare the email data
const user = await User.findById(userId);

// Populate product details for the email
const populatedOrder = await Order.findById(order._id).populate('items.product', 'product_name');

// Transform items for email
const emailItems = populatedOrder.items.map(item => ({
  name: item.product.product_name,
  quantity: item.quantity,
  price: item.price
}));

// Calculate dates
const orderDate = new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

const estimatedDeliveryDate = new Date();
estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7); // 7 days from now
const estimatedDelivery = estimatedDeliveryDate.toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

// Prepare email data with all required fields
const emailData = {
  orderId: order._id.toString(),
  customerName: user.fullName || user.name || 'Valued Customer',
  items: emailItems,
  subtotal: calculatedAmount,
  shipping: 0, // Add your shipping calculation here
  tax: 0, // Add your tax calculation here
  total: calculatedAmount,
  shippingAddress: {
    street: shippingAddress.address,
    city: shippingAddress.city,
    state: '', // Add if you have state
    zipCode: shippingAddress.postalCode,
    country: 'Nepal' // Or get from your address data
  },
  orderDate,
  estimatedDelivery
};

await sendOrderConfirmationEmail(user.Email, emailData);
  


  return res.status(200).json({
    success: true,
    message: "Payment verified and order created successfully",
    order,
  });
});

const createCODPayment = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { isBuyNow, buyNowItem } = req.body;

    let itemsToOrder = [];
    let totalAmount = 0;

    if (isBuyNow && buyNowItem) {
      // Handle Buy Now Order (COD)
      const product = await Product.findById(buyNowItem.productId).session(
        session,
      );
      if (!product) {
        throw new Apierror(404, "Product not found");
      }
      if (product.stock < buyNowItem.quantity) {
        throw new Apierror(
          400,
          `Insufficient stock for ${product.product_name}`,
        );
      }

      totalAmount = product.price * buyNowItem.quantity;
      itemsToOrder.push({
        product: product._id,
        quantity: buyNowItem.quantity,
        price: product.price,
      });

      // Update stock
      await Product.updateOne(
        { _id: product._id },
        { $inc: { stock: -buyNowItem.quantity } },
        { session },
      );
    } else {
      // Handle Cart Order (COD)
      const cart = await Cart.findOne({ userId })
        .populate("products.productId", "product_name price stock")
        .session(session);

      if (!cart || cart.products.length === 0) {
        throw new Apierror(400, "Cart is empty");
      }

      // VALIDATE STOCK AND CALCULATE TOTAL
      for (let item of cart.products) {
        if (item.productId.stock < item.quantity) {
          throw new Apierror(
            400,
            `Insufficient stock for ${item.productId.product_name}`,
          );
        }
        totalAmount += item.productId.price * item.quantity;
        itemsToOrder.push({
          product: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
        });
      }

      // UPDATE STOCK
      for (let item of cart.products) {
        await Product.updateOne(
          { _id: item.productId._id },
          { $inc: { stock: -item.quantity } },
          { session },
        );
      }

      // CLEAR CART
      cart.products = [];
      cart.totalAmount = 0;
      await cart.save({ session });
    }

    // PAYMENT
    const payment = await Payment.create(
      [
        {
          userId,
          transaction_uuid: `COD-${Date.now()}`,
          amount: totalAmount,
          paymentMethod: "CashOnDelivery",
          status: "Pending",
          paidAt: null,
        },
      ],
      { session },
    );

    // ORDER
     const savedAddr = await Address.findOne({ userId });
  if (!savedAddr) {
    throw new Apierror(400, "No address found for user");
  }
   let shippingAddress = {
      fullName: savedAddr.fullName,
      phoneNumber: savedAddr.phoneNumber,
      address: savedAddr.address,
      city: savedAddr.city,
      postalCode: savedAddr.postalCode,
      email: savedAddr.email,
    };
    const order = await Order.create(
      [
        {
          user: userId,
          shippingAddress,
          savedAddress: savedAddr._id,
          items: itemsToOrder,
          amount: totalAmount,
          orderStatus: "Pending",
          paymentStatus: "Pending",
          transactionId: payment[0].transaction_uuid,
          payment: payment[0]._id,
        },
      ],
      { session },
    );

    // Link payment → order
    payment[0].orderId = order[0]._id;
    await payment[0].save({ session });

    await session.commitTransaction();
    session.endSession();
    try {
      const user = await User.findById(userId);
      
      // Populate product details for email
      const populatedOrder = await Order.findById(order[0]._id).populate(
        'items.product', 
        'product_name'
      );

      // Transform items for email
      const emailItems = populatedOrder.items.map(item => ({
        name: item.product.product_name,
        quantity: item.quantity,
        price: item.price
      }));

      // Calculate dates
      const orderDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);
      const estimatedDelivery = estimatedDeliveryDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      // Prepare email data
      const emailData = {
        orderId: order[0]._id.toString(),
        customerName: user.fullName || user.name || 'Valued Customer',
        items: emailItems,
        subtotal: totalAmount,
        shipping: 0, // Add your shipping cost
        tax: 0, // Add your tax calculation
        total: totalAmount,
        shippingAddress: {
          street: shippingAddress.address,
          city: shippingAddress.city,
          state: '', // Add if available
          zipCode: shippingAddress.postalCode,
          country: 'Nepal'
        },
        orderDate,
        estimatedDelivery
      };

      await sendOrderConfirmationEmail(user.Email, emailData);
    } catch (emailError) {
      // Log email error but don't fail the order
      console.error('Failed to send order confirmation email:', emailError);
    }

    return res.status(201).json({
      success: true,
      message: "COD order placed successfully",
      orderId: order[0]._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const getPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const payments = await Payment.find({ userId }).sort({ paidAt: -1 });
  return res.status(200).json({
    results: payments.length,
    payments,
  });
});

export { createSignature, verifyPayment, createCODPayment, getPaymentHistory };
