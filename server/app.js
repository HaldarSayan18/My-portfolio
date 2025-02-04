require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Contact Form Route
app.post("/contact", async (req, res) => {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Set up transporter for nodemailer
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL, // Your email
                pass: process.env.EMAIL_PASSWORD, // App-specific password
            },
        });

        // Beautifully Styled Email Content (HTML)
        let mailOptions = {
            from: process.env.EMAIL,
            to: process.env.RECEIVER_EMAIL, // Admin Email
            subject: `📩 Email from ${fullName}`,
            html: `
                <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header Section -->
                    <div style="background-color: #007bff; color: white; padding: 15px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h2>📬 New Contact Form Message</h2>
                    </div>

                    <!-- Content Section -->
                    <div style="padding: 20px; background: white; border-radius: 0 0 10px 10px;">
                        <p style="font-size: 18px; font-weight: bold; color: #333;">Hello, you've received a new message!</p>
                        
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 5px solid #007bff;">
                            <p><strong>👤 Name:</strong> ${fullName}</p>
                            <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></p>
                            <p><strong>📞 Phone:</strong> ${phone}</p>
                        </div>

                        <p style="margin-top: 15px; font-weight: bold; color: #444;">💬 Message:</p>
                        <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; font-style: italic; color: #333;">
                            "${message}"
                        </div>

                        <div style="margin-top: 20px; text-align: center;">
                            <a href="mailto:${email}" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; font-size: 16px; display: inline-block;">
                                Reply to ${fullName}
                            </a>
                        </div>

                        <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;">

                        <!-- Footer -->
                        <p style="text-align: center; font-size: 14px; color: #666;">
                            This message was sent from your website contact form.
                        </p>
                    </div>
                </div>
            `,
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: "Message sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Email sending failed" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
