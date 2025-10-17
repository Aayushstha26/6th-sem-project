import { Order } from "../models/order.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";
import { Apiresponse } from "../utils/apiRespone.js";
const createOrder = asyncHandler(async (req, res) => {
  const { paymentStatus, transactionId } = req.body;
  const userId = req.user._id;
  // if (!userId || !items ||  !amount) {
  // throw new Apierror(400, "All fields are required");
  // }
  if (paymentStatus !== "Success") {
    throw new Apierror(400, "Payment not successful");
  }
  const cart = await Cart.findOne({ userId }).populate(
    "products.productId",
    "product_name price "
  );
  if (!cart || cart.products.length === 0) {
    throw new Apierror(400, "Cart is empty");
  }

  let amount = 0;
  cart.products.forEach((item) => {
    amount += item.productId.price * item.quantity;
  });
  // if(items.length === 0){
  //     throw new Apierror(400, "No items in the order");
  // }
  const order = await Order.create({
    user: userId,
    items: cart.products.map((item) => ({
      product: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    })),
    amount: amount,
    orderStatus: "Pending",
    paymentStatus: "Paid",
    transactionId: transactionId,
  });
  cart.products = [];
  cart.totalAmount = 0;
  await cart.save();
  return res
    .status(201)
    .json(new Apiresponse(201, "Order created successfully", order));
});

export { createOrder };
