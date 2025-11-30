import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateHash } from "../utils/crypto.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
const createSignature = asyncHandler(async (req, res) => {
    const { total_amount, transaction_uuid, product_code } = req.body;
    console.log("Generating signature for:", { total_amount, transaction_uuid, product_code });
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
    const { total_amount, transaction_uuid, product_code, received_signature } = req.body;
    if (!total_amount || !transaction_uuid || !product_code || !received_signature) {
        throw new Apierror(400, "Missing required fields");
    }
    const userId = req.user._id;
    const expected_signature = generateHash(transaction_uuid, total_amount, product_code);
    if (expected_signature !== received_signature) {
        throw new Apierror(400, "Invalid signature");
    }
    const verifyUrl = "https://rc-epay.esewa.com.np/api/epay/transaction/status/";
    const payload = {
        amount : total_amount,
        transactionId : transaction_uuid,
        productCode : product_code,
    };
   const response = await fetch(verifyUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Apierror(400, "Payment verification failed");
    }
    const data = await response.json();
    console.log("esewa verification :"+data);
    if (data.status !== "COMPLETE") {
        throw new Apierror(400, "Payment not successful");
    }

    const cart = await Cart.findOne({ userId }).populate(
        "products.productId",
        "product_name price "
    );;
    if (!cart || cart.products.length === 0) {
       throw new Apierror(400, "Cart is empty");
    }
    let amount = 0;
    cart.products.forEach((item) => {
        amount += item.productId.price * item.quantity;
    });
    if (amount != total_amount) {
        throw new Apierror(400, "Amount mismatch");
    }

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
        transactionId: transaction_uuid,
    }); 
    if (!order) {
        throw new Apierror(500, "Failed to create order");
    }

    for(let item of cart.products){
        const product = item.productId;
        product.stock -= item.quantity;
        await product.save();
    }
    cart.products = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(200).json({
        success: true,
        message: "Payment verified and order created successfully",
        order,
    });
});


export { createSignature  , verifyPayment };