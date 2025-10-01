import axios from 'axios';
import { NextResponse } from 'next/server';
// 💡 REMOVED: import nodemailer from 'nodemailer';

// 1. Install 'resend' and import the SDK
import { Resend } from 'resend';

// 2. Initialize Resend using the API Key
// This initialization is server-side and safe.
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to send a message via Telegram (KEPT AS IS)
async function sendTelegramMessage(token, chat_id, message) {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, {
      text: message,
      chat_id,
    });
    return res.data.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error.response?.data || error.message);
    return false;
  }
};

// HTML email template (KEPT AS IS)
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// 3. Updated helper function to send an email via Resend API
async function sendEmail(payload, message) {
  const { name, email, message: userMessage } = payload;
  
  try {
    // The 'from' field MUST be an email address or domain you have verified with Resend.
    const { data, error } = await resend.emails.send({
      from: `Portfolio <onboarding@resend.dev>`, // ⚠️ Replace with your verified address/domain
      to: process.env.EMAIL_ADDRESS, // The recipient (your email)
      subject: `New Message From ${name}`,
      text: message,
      html: generateEmailTemplate(name, email, userMessage),
      replyTo: email, 
    });

    if (error) {
      console.error('Error while sending email via Resend:', error.message);
      return false;
    }
    return true;
  } catch (error) {
    console.error('API call error to Resend:', error.message);
    return false;
  }
};

export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    // Validate environment variables
    if (!token || !chat_id) {
      return NextResponse.json({
        success: false,
        message: 'Telegram token or chat ID is missing.',
      }, { status: 400 });
    }

    // **Crucially, ensure RESEND_API_KEY is present here too if you remove the nodemail code.**
    if (!process.env.RESEND_API_KEY) {
        return NextResponse.json({
            success: false,
            message: 'Resend API Key is missing.',
        }, { status: 400 });
    }

    const message = `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${userMessage}\n\n`;

    // Send Telegram message
    const telegramSuccess = await sendTelegramMessage(token, chat_id, message);

    // Send email (Now uses the reliable Resend API)
    const emailSuccess = await sendEmail(payload, message);

    if (telegramSuccess && emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Message and email sent successfully!',
      }, { status: 200 });
    }

    // Improved error reporting
    const failureReason = [];
    if (!telegramSuccess) failureReason.push("Telegram");
    if (!emailSuccess) failureReason.push("Email");

    return NextResponse.json({
      success: false,
      message: `Failed to send: ${failureReason.join(' and ')}. Check server logs.`,
    }, { status: 500 });

  } catch (error) {
    console.error('API Error:', error.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
};