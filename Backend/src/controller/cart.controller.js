import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
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

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    throw new Apierror(404, "Product not found");
  }
  // if(quantity <=1){
  //   throw new Apierror(400, "Quantity must be at least 1");
  // }
 
  console.log(quantity);
  
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [], totalAmount: 0 });
  }

  const productIndex = cart.products.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (productIndex > -1) {
      const newQuantity =
      cart.products[productIndex].quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Apierror(400, `Only ${product.stock} items in stock`);
    }

    cart.products[productIndex].quantity = newQuantity;
  } else {
    if (quantity > product.stock) {
      throw new Apierror(400, `Only ${product.stock} items in stock`);
    }
    cart.products.push({ productId: productId, quantity: quantity || 1 });
  }
  cart.totalAmount = await calculateTotalAmount(cart);
  await cart.save();

  return res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});
const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate(
    "products.productId",
    "product_name price productImg stock "
  );
  if (!cart) {
    throw new Apierror(404, "Cart not found");
  }
  return res.status(200).json({
    cart,
  });
});
const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Apierror(404, "Cart not found");
  }
   cart.products = cart.products.filter(
    (item) => item.productId.toString() !== productId
  );  
  cart.totalAmount = await calculateTotalAmount(cart);
  await cart.save();
  return res.status(200).json({
    success: true,
    message: "Product removed from cart",
    cart,
  });
});
const getCartCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cartItems = await Cart.findOne({ userId: userId });
  const itemCount = cartItems ? calculateCartCount(cartItems) : 0;
  return res.status(200).json({
    itemCount,
  });
});
function calculateCartCount(cart) {
  let count = 0;

  for (let i = 0; i < cart.products.length; i++) {
    count += cart.products[i].quantity;
  }

  return count;
}

export { addToCart, getCart , removeFromCart, getCartCount };
