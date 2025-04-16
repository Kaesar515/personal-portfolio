// Basic Express server to handle the /api/send-message route during development

import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.development.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.development.local') });

const app = express();
const PORT = process.env.PORT || 3001; // Port for the backend server

// Middleware
app.use(cors()); // Allow requests from Vite dev server
app.use(express.json()); // Parse JSON request bodies

// --- Replicated Logic from api/send-message.js ---

// Helper function to escape HTML characters (same as before)
function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// Initialize Resend and get config (same as before)
const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.TO_EMAIL_ADDRESS;
const fromEmail = process.env.FROM_EMAIL_ADDRESS || 'contact@aliajib.com';
const hCaptchaSecret = process.env.HCAPTCHA_SECRET_KEY;

// Define the POST route handler for /api/send-message
app.post('/api/send-message', async (req, res) => {
  console.log('Express server received request for /api/send-message'); // Add log

  // Destructure hCaptcha token along with form data from req.body
  const { user_name, user_email, subject, message, hCaptchaToken } = req.body;

  // Basic validation
  if (!user_name || !user_email || !subject || !message || !hCaptchaToken) {
    console.log('Validation failed: Missing fields or token');
    return res.status(400).json({ success: false, message: 'Missing required fields or CAPTCHA token' });
  }

  // hCaptcha Verification
  if (!hCaptchaSecret) {
    console.error('HCAPTCHA_SECRET_KEY environment variable is not set.');
    return res.status(500).json({ success: false, message: 'Server configuration error (hCaptcha).' });
  }

  try {
    const captchaVerifyResponse = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `response=${encodeURIComponent(hCaptchaToken)}&secret=${encodeURIComponent(hCaptchaSecret)}`,
    });
    const captchaData = await captchaVerifyResponse.json();
    console.log('hCaptcha verification response:', captchaData);
    if (!captchaData.success) {
      let errorMessage = 'CAPTCHA verification failed.';
      if (captchaData['error-codes']?.length > 0) {
        errorMessage += ` Reason: ${captchaData['error-codes'].join(', ')}`;
      }
      console.log('hCaptcha verification failed:', errorMessage);
      return res.status(400).json({ success: false, message: errorMessage });
    }
  } catch (captchaError) {
    console.error('Error verifying hCaptcha:', captchaError);
    return res.status(500).json({ success: false, message: 'Error verifying CAPTCHA.' });
  }

  // Sanitize inputs
  const sanitizedName = escapeHtml(user_name);
  const sanitizedEmail = escapeHtml(user_email);
  const sanitizedSubject = escapeHtml(subject);
  const sanitizedMessage = escapeHtml(message);

  // Check other required env vars
  if (!toEmail) {
      console.error('TO_EMAIL_ADDRESS environment variable is not set.');
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }
   if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set.');
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }

  // Send email using Resend
  try {
    console.log('Attempting to send email via Resend...');
    const data = await resend.emails.send({
      from: `Ali Ajib Portfolio <${fromEmail}>`,
      to: [toEmail],
      subject: `from your portfolio: ${sanitizedSubject}`,
      reply_to: sanitizedEmail,
      html: `<h1>Portfolio Contact Message</h1><p><strong>Name:</strong> ${sanitizedName}</p><p><strong>Email:</strong> ${sanitizedEmail}</p><p><strong>Subject:</strong> ${sanitizedSubject}</p><hr><p><strong>Message:</strong></p><p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>`,
    });
    console.log('Resend response:', data);
    if (data.error) {
        console.error('Resend API Error:', data.error);
        return res.status(500).json({ success: false, message: data.error.message || 'Failed to send email via Resend.' });
    }
    console.log('Email sent successfully!');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    const errorMessage = error.message || 'An unexpected error occurred while sending the email.';
    return res.status(500).json({ success: false, message: errorMessage });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
}); 