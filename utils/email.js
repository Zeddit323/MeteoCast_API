

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const SENDER_EMAIL = process.env.BREVO_VERIFIED_SENDER;

// Helper function to handle the native fetch request to Brevo's v3 SMTP endpoint
const sendBrevoEmail = async ({ toEmail, subject, textContent, htmlContent }) => {
    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "MeteoCast Support", email: SENDER_EMAIL },
                to: [{ email: toEmail }],
                subject: subject,
                textContent: textContent,
                htmlContent: htmlContent
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `Brevo API responded with status ${response.status}`);
        }

        console.log(`Email ("${subject}") successfully sent to ${toEmail}. MessageID:`, data.messageId);
        return { success: true, data };
    } catch (error) {
        console.error(`CRITICAL MAIL ERROR [${subject}]:`, error.message);
        return { success: false, error: error.message };
    }
};

// 1. Send Password Reset Link Email
export const sendPasswordResetEmail = async (email, link) => {
    return await sendBrevoEmail({
        toEmail: email,
        subject: "Password Reset Request",
        textContent: `Forgot your password? Reset it here: ${link}`,
        htmlContent: `
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
        `
    });
};

// 2. Send Password Reset Confirmation Email
export const sendPasswordResetConfirmationEmail = async (email) => {
    return await sendBrevoEmail({
        toEmail: email,
        subject: "Your password has been reset",
        textContent: "Success! Your Meteocast password was recently changed. If this was you, you can safely ignore this email.",
        htmlContent: `
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
        `
    });
};

// 3. Send Account Deletion Confirmation Email
export const sendAccountDeletionConfirmation = async (email) => {
    return await sendBrevoEmail({
        toEmail: email,
        subject: "Your account has been deleted",
        textContent: "Your account has been deleted successfully. If this was you, you can safely ignore this email.",
        htmlContent: `
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
        `
    });
};

// 4. Send Account Creation Welcome Email
export const sendAccountCreationEmail = async (email, name = "there") => {
    return await sendBrevoEmail({
        toEmail: email,
        subject: "Welcome to MeteoCast!",
        textContent: `Welcome to MeteoCast, ${name}! Your account has been successfully created. Start exploring your weather forecasts now.`,
        htmlContent: `
            <div style="color: #f9f9f9; background-image: linear-gradient(to right, #69D7FF, #00AFA7); font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #01555b; padding: 20px;">
                <h2 style="color: #01555b;">Welcome to MeteoCast!</h2>
                <p>Hi ${name},</p>
                <p>We're thrilled to have you on board! Your <strong>MeteoCast</strong> account has been successfully created. You now have access to hyper-local weather insights, real-time alerts, and personalized forecasts.</p>
                
                <div style="color: #00aab7; background-color: #caf0fd; padding: 15px; border-left: 4px solid #00AFA7; margin: 20px 0;">
                    <p style="margin: 0;"><span style="color: #01555b;"><strong>Account Status:</strong></span> Active</p>
                    <p style="margin: 0;"><span style="color: #01555b;"><strong>Registered Email:</strong></span> ${email}</p>
                </div>
                
                <p>If you did <strong>not</strong> sign up for this account, please disregard this email or reach out to our support team to secure your information.</p>
                <p>Clear skies ahead,<br>The Meteocast Team</p>
            </div>
        `
    });
};
