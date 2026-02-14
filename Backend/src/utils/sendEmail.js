import nodemailer from "nodemailer";

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    timeout: 10000,
  });
};

// Send OTP Email
const sendOtpToEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. Valid for 5 minutes.`,
      html: `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 700px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      
      <div style="background-color: #4F46E5; padding: 20px; text-align: center;">
        <h2 style="color: #ffffff; margin: 0;">🔐 Email Verification</h2>
      </div>
      
      <div style="padding: 25px; text-align: center;">
        <p style="font-size: 16px; color: #333;">Hello,</p>
        <p style="font-size: 15px; color: #555;">
          Use the following one-time password (OTP) to verify your email. 
          This OTP is valid for <strong>5 minutes</strong>.
        </p>
        
        <div style="margin: 25px auto; width: fit-content; background: #f3f4f6; padding: 10px 25px; border-radius: 8px;">
          <h1 style="letter-spacing: 4px; color: #111; margin: 0;">${otp}</h1>
        </div>

        <p style="color: #888; font-size: 13px; margin-top: 25px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>

      <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} Secure Verification System. All rights reserved.
      </div>

    </div>
  </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending OTP to ${email}:`, error);
    throw new Error("Failed to send OTP email");
  }
};

// Send Order Confirmation Email
const sendOrderConfirmationEmail = async (email, orderData) => {
  try {
    const {
      orderId,
      customerName,
      items,
      subtotal,
      shipping,
      tax,
      total,
      shippingAddress,
      orderDate,
      estimatedDelivery,
    } = orderData;

    const transporter = createTransporter();
    
    // Generate items HTML
    const itemsHtml = items
      .map(
        (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500; color: #111;">${item.name}</div>
          <div style="font-size: 13px; color: #666;">Qty: ${item.quantity}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111;">
          $${item.price.toFixed(2)}
        </td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmation - #${orderId}`,
      text: `Thank you for your order! Order ID: ${orderId}. Total: $${total.toFixed(2)}`,
      html: `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 700px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
        <div style="font-size: 40px; margin-bottom: 10px;">✅</div>
        <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmed!</h2>
        <p style="color: #d1fae5; margin: 8px 0 0 0; font-size: 14px;">Thank you for your purchase</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px 25px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 5px;">Hi ${customerName},</p>
        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          We've received your order and are getting it ready. You'll receive a notification when your order is on its way.
        </p>
        
        <!-- Order Details Box -->
        <div style="background: #f9fafb; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 14px;">Order Number:</span>
            <span style="color: #111; font-weight: 600;">#${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 14px;">Order Date:</span>
            <span style="color: #111;">${orderDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666; font-size: 14px;">Estimated Delivery:</span>
            <span style="color: #10b981; font-weight: 600;">${estimatedDelivery}</span>
          </div>
        </div>

        <!-- Order Items -->
        <h3 style="color: #111; font-size: 18px; margin: 25px 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          Order Items
        </h3>
        <table style="width: 100%; border-collapse: collapse;">
          ${itemsHtml}
        </table>

        <!-- Order Summary -->
        <div style="margin-top: 20px; padding: 20px; background: #f9fafb; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #666;">Subtotal:</span>
            <span style="color: #111;">$${subtotal.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #666;">Shipping:</span>
            <span style="color: #111;">$${shipping.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
            <span style="color: #666;">Tax:</span>
            <span style="color: #111;">$${tax.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #111; font-weight: 600; font-size: 16px;">Total:</span>
            <span style="color: #10b981; font-weight: 600; font-size: 18px;">$${total.toFixed(2)}</span>
          </div>
        </div>

        <!-- Shipping Address -->
        <h3 style="color: #111; font-size: 18px; margin: 25px 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          Shipping Address
        </h3>
        <div style="color: #555; line-height: 1.8; font-size: 14px;">
          ${shippingAddress.street}<br>
          ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
          ${shippingAddress.country}
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0 20px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://yourstore.com'}/orders/${orderId}" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Track Your Order
          </a>
        </div>

        <p style="color: #888; font-size: 13px; margin-top: 25px; text-align: center;">
          Questions? Contact our support team at ${process.env.SUPPORT_EMAIL || 'support@yourstore.com'}
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} Your Store. All rights reserved.
      </div>

    </div>
  </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending order confirmation to ${email}:`, error);
    throw new Error("Failed to send order confirmation email");
  }
};

// Send Order Delivered Email
const sendOrderDeliveredEmail = async (email, deliveryData) => {
  try {
    const {
      orderId,
      customerName,
      deliveryDate,
      items,
      total,
      deliveryAddress,
      trackingNumber,
    } = deliveryData;

    const transporter = createTransporter();
    
    // Generate items summary
    const itemsSummary = items
      .map((item) => `<li style="margin: 5px 0; color: #555;">${item.quantity}x ${item.name}</li>`)
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Your Order Has Been Delivered! - #${orderId}`,
      text: `Your order #${orderId} has been delivered! Thank you for shopping with us.`,
      html: `
  <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 700px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 30px 20px; text-align: center;">
        <div style="font-size: 50px; margin-bottom: 10px;">📦</div>
        <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Delivered Successfully!</h2>
        <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 14px;">Your order has arrived</p>
      </div>
      
      <!-- Content -->
      <div style="padding: 30px 25px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 5px;">Hi ${customerName},</p>
        <p style="font-size: 15px; color: #555; line-height: 1.6;">
          Great news! Your order has been delivered. We hope you enjoy your purchase!
        </p>
        
        <!-- Delivery Info Box -->
        <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #666; font-size: 14px;">Order Number:</span>
            <span style="color: #111; font-weight: 600;">#${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span style="color: #666; font-size: 14px;">Delivered On:</span>
            <span style="color: #111; font-weight: 600;">${deliveryDate}</span>
          </div>
          ${
            trackingNumber
              ? `
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666; font-size: 14px;">Tracking Number:</span>
            <span style="color: #111; font-weight: 500;">${trackingNumber}</span>
          </div>
          `
              : ""
          }
        </div>

        <!-- Delivered Items -->
        <h3 style="color: #111; font-size: 18px; margin: 25px 0 15px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
          Items Delivered
        </h3>
        <ul style="padding-left: 20px; margin: 15px 0;">
          ${itemsSummary}
        </ul>

        <!-- Delivery Address -->
        <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="color: #111; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Delivered To:</h4>
          <div style="color: #555; line-height: 1.6; font-size: 14px;">
            ${deliveryAddress.street}<br>
            ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zipCode}<br>
            ${deliveryAddress.country}
          </div>
        </div>

        <!-- Order Total -->
        <div style="background: #f0fdf4; border: 1px solid #86efac; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
          <span style="color: #666; font-size: 14px;">Order Total: </span>
          <span style="color: #10b981; font-weight: 600; font-size: 18px;">$${total.toFixed(2)}</span>
        </div>

        <!-- Review CTA -->
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 6px;">
          <p style="color: #92400e; margin: 0 0 10px 0; font-weight: 500;">📝 Love your purchase?</p>
          <p style="color: #78350f; margin: 0; font-size: 14px;">
            Share your experience and help others make informed decisions. Your feedback matters!
          </p>
        </div>

        <!-- CTA Buttons -->
        <div style="text-align: center; margin: 30px 0 20px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://yourstore.com'}/orders/${orderId}/review" 
             style="display: inline-block; background: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 5px;">
            Write a Review
          </a>
          <a href="${process.env.FRONTEND_URL || 'https://yourstore.com'}/orders/${orderId}" 
             style="display: inline-block; background: #6b7280; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; margin: 0 5px;">
            View Order Details
          </a>
        </div>

        <!-- Support Section -->
        <div style="margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; text-align: center;">
          <p style="color: #111; font-weight: 500; margin: 0 0 8px 0;">Need Help?</p>
          <p style="color: #666; margin: 0; font-size: 13px;">
            If there's any issue with your order, please contact us at<br>
            <a href="mailto:${process.env.SUPPORT_EMAIL || 'support@yourstore.com'}" 
               style="color: #3b82f6; text-decoration: none;">
              ${process.env.SUPPORT_EMAIL || 'support@yourstore.com'}
            </a>
          </p>
        </div>

        <p style="color: #888; font-size: 13px; margin-top: 25px; text-align: center;">
          Thank you for shopping with us!
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #666;">
        © ${new Date().getFullYear()} Your Store. All rights reserved.
      </div>

    </div>
  </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order delivered email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error(`Error sending order delivered email to ${email}:`, error);
    throw new Error("Failed to send order delivered email");
  }
};

export { sendOtpToEmail, sendOrderConfirmationEmail, sendOrderDeliveredEmail };