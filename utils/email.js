import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    ...(process.env.SMTP_USER && {
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        }
    }),
});

//TODO: Write nice html for mails

export const sendPasswordResetEmail = async (email, link) => {
    await transporter.sendMail({
        from: '"Meteocast Support" <no-reply@meteocast.com>', 
        to: email,
        subject: "Password Reset Request",
        text: `Forgot your password? Reset it here: ${link}`, 
        html: `
            <div style="font-family: sans-serif; line-height: 1.5;">
                <p>Hi,</p>
                <p>Forgot your password? No worries! Click the link below to reset it:</p>
                <p><a href="${link}" style="color: #007bff;">Reset Password</a></p>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <hr />
                <p style="font-size: 0.8em; color: #555;">This link will expire in 10 minutes.</p>
            </div>
        `,
    });
};

export const sendPasswordResetConfirmationEmail = async (email) => {
    await transporter.sendMail({
        from: '"Meteocast Support" <no-reply@meteocast.com>',
        to: email,
        subject: "Your password has been reset",
        text: "Success! Your Meteocast password was recently changed. If this was you, you can safely ignore this email.",
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h2 style="color: #2d3436;">Password Changed Successfully</h2>
                <p>Hi there,</p>
                <p>This is a confirmation that the password for your <strong>Meteocast</strong> account has been successfully changed.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #00b894; margin: 20px 0;">
                    <p style="margin: 0;"><strong>Status:</strong> Completed</p>
                    <p style="margin: 0;"><strong>Time:</strong> ${new Date().toUTCString()}</p>
                </div>
                <p>If you did <strong>not</strong> request this change, please contact our support team immediately or try to recover your account.</p>
                <p>Stay safe,<br>The Meteocast Team</p>
            </div>
        `,
    });
};