import { Apierror } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateHash } from "../utils/crypto.js";

const createSignature = asyncHandler(async (req, res) => {
    const { total_amount, transaction_uuid, product_code } = req.body;
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



export { createSignature };