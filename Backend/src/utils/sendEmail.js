import nodemailer from 'nodemailer';

const sendOtpToEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        }); 
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
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
          If you didn’t request this, you can safely ignore this email.
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
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error);
        throw new Error('Failed to send OTP email');
    }   
};

export default sendOtpToEmail;