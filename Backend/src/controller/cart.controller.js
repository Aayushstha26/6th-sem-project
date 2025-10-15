import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productid, quantity } = req.body;
  const product = await Product.findById(productid);
  if (!product) {
    throw new Apierror(404, "Product not found");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [], totalAmount: 0 });
  }

  const productIndex = cart.products.findIndex(
    (item) => item.productId.toString() === productid
  );
  if (productIndex > -1) {
    cart.products[productIndex].quantity += quantity || 1;
  } else {
    cart.products.push({ productId: productid, quantity: quantity || 1 });
  }
  cart.totalAmount = await calculateTotalAmount(cart);
  await cart.save();

  return res.status(200).json({
    cart,
  });
});
const calculateTotalAmount = async (cart) => {
  let total = 0;
  for (const item of cart.products) {
    const product = await Product.findById(item.productId);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  return total;
};
export { addToCart };
