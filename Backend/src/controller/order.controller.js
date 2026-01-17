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

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "Firstname Lastname Email")
    .populate({
      path: "items.product",
      select: "product_name price productImg",
    });
  return res
    .status(200)
    .json(new Apiresponse(200, "Orders fetched successfully", orders));
});

const getUserOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ user: userId }).populate(
    "items.product",
    "product_name price productImg"
  );
  if (!orders) {
    throw new Apierror(404, "No orders found for this user");
  }
  console.log(orders);
  return res
    .status(200)
    .json(new Apiresponse(200, "User orders fetched successfully", orders));
});
const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) {
    throw new Apierror(404, "Order not found");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, "Order deleted successfully", null));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const validStatuses = ["Pending", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Apierror(400, "Invalid order status");
  }
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Apierror(404, "Order not found");
  }
  order.orderStatus = status;
  await order.save();
  return res
    .status(200)
    .json(new Apiresponse(200, "Order status updated successfully", order));
});
const getOrderByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const validStatuses = ["Pending", "Delivered", "Cancelled"];
  if (!validStatuses.includes(status)) {
    throw new Apierror(400, "Invalid order status");
  }
  const orders = await Order.find({ orderStatus: status });
  return res
    .status(200)
    .json(new Apiresponse(200, "Orders fetched successfully", orders));
});
const getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const order = await Order.findById(orderId)
    .populate("user", "Firstname Lastname Email")
    .populate("items.product", "product_name price productImg");
  if (!order) {
    throw new Apierror(404, "Order not found");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, "Order fetched successfully", order));
});

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  deleteOrder,
  updateOrderStatus,
  getOrderByStatus,
  getOrderById,
};
