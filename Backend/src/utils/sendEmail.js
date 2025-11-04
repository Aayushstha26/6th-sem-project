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
            html: `<h3>Your OTP: <strong>${otp}</strong></h3><p>Valid for 5 minutes.</p>`,
        };  

        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error);
        throw new Error('Failed to send OTP email');
    }   
};

export default sendOtpToEmail;