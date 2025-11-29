import crypto from "crypto";

const generateHash = (transaction_uuid, total_amount, product_code) => {
  try {
    const data = `transaction_uuid=${transaction_uuid}&total_amount=${total_amount}&product_code=${product_code}`;
    const secretKey = process.env.ESEWA_SECRET_KEY;
    if (!secretKey) {
      throw new Error("Secret key not found in environment variables");
    }
    const hash = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("hex");
    return hash;
  } catch (error) {
    throw new Error("Error generating hash");
  }
};

export { generateHash };