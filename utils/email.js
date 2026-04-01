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
            <div style="color: #f9f9f9; background-image: linear-gradient(to right, #69D7FF, #00AFA7); font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #01555b; padding: 20px;">
                <h2 style="color: #01555b;">Forgot your password?</h2>
                <p>Hi there,</p>
                <p>It happens to the best of us! We received a request to reset the password for your <strong>Meteocast</strong> account. You can get back into your account by clicking the button below to choose a new one:</p>
                <div style="display: flex; justify-content: center;">
                    <a style="
                        width: 60%;
                        padding: 3%;
                        border-radius: 10px;
                        border: none;
                        background-color: #008b95;
                        color: #f9f9f9;
                        font-size: 1.3rem;
                        font-weight: bold;
                        text-decoration: none;
                        text-align: center;"
                        href="${link}"
                    >
                        Reset My Password</a>
                </div>
                <p>If you did <strong>not</strong> request this, please ignore this email; your password will stay exactly as it is. For your security, this link will expire in 24 hours.</p>
                <p>Stay safe,<br>The Meteocast Team</p>
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
            <div style="color: #f9f9f9; background-image: linear-gradient(to right, #69D7FF, #00AFA7); font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #01555b; padding: 20px;">
                <h2 style="color: #01555b;">Password Changed Successfully</h2>
                <p>Hi there,</p>
                <p>This is a confirmation that the password for your <strong>Meteocast</strong> account has been successfully
                    changed.</p>
                <div style="color: #00aab7; background-color: #caf0fd; padding: 15px; border-left: 4px solid #00AFA7; margin: 20px 0;">
                    <p style="margin: 0;"><span style="color: #01555b;"><strong>Status:</strong></span> Completed</p>
                    <p style="margin: 0;"><span style="color: #01555b;"><strong>Time:</strong></span> ${new Date().toUTCString()}</p>
                </div>
                <p>If you did <strong>not</strong> request this change, please contact our support team immediately or try to
                    recover your account.</p>
                <p>Stay safe,<br>The Meteocast Team</p>
            </div>
        `,
    });
};

export const sendAccountDeletionConfirmation = async (email) => {
    await transporter.sendMail({
        from: '"Meteocast Support" <no-reply@meteocast.com>',
        to: email,
        subject: "Your account has been deleted",
        text: "Your account has been deleted successfully. If this was you, you can safely ignore this email.",
        html: `
            <div style="color: #f9f9f9; background-image: linear-gradient(to right, #69D7FF, #00AFA7); font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #01555b; padding: 20px;">
                <h2 style="color: #01555b;">Account Deleted Successfully</h2>
                <p>Hi there,</p>
                <p>This is a confirmation that your <strong>Meteocast</strong> account has been successfully closed and your
                    data has been queued for removal.</p>
                <div
                    style="color: #00aab7; background-color: #caf0fd; padding: 15px; border-left: 4px solid #00AFA7; margin: 20px 0;">
                    <p style="margin: 0;"><span style="color: #01555b;"><strong>Status:</strong></span> Account Closed</p>
                    <p style="margin: 0;"><span style="color: #01555b;"><strong>Time:</strong></span> ${new
                        Date().toUTCString()}</p>
                </div>
                <p>We're sorry to see you go. Please note that it may take a few days for all records to be completely purged
                    from our systems.</p>
                <p>If you did <strong>not</strong> request this deletion, please contact our support team immediately, though
                    please be aware that account recovery may not be possible once the process is complete.</p>
                <p>Best regards,<br>The Meteocast Team</p>
            </div>
        `,
    });
};