/**
 * Created by Ali Ajib - https://aliajib.com
 * Licensed under CC BY-NC-SA 4.0. If you reuse or modify this project, please keep this notice.
 */

import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';

// Determine the correct .env file path based on NODE_ENV
const envPath = process.env.NODE_ENV === 'production'
  ? path.resolve(process.cwd(), '.env.production.local') // Adjust if you use a different naming convention for production
  : path.resolve(process.cwd(), '.env.development.local');

dotenv.config({ path: envPath });

// --- Configuration via Environment Variables ---
// This function relies on environment variables for configuration and secrets.
// Ensure the following are set in your environment (e.g., .env.local file or Vercel Project Settings):
// - RESEND_API_KEY: Your Resend API key.
// - TO_EMAIL_ADDRESS: The email address where contact form submissions will be sent.
// - FROM_EMAIL_ADDRESS: The email address used to send emails (must be from a Resend verified domain).
// -------------------------------------------------

// Helper function to escape HTML characters
function escapeHtml(unsafe) {
  if (!unsafe) return ''; // Return empty string if input is null or undefined
  return unsafe
       .toString() // Ensure it's a string
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/"/g, "&quot;")
       .replace(/'/g, "&#039;");
}

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);
const toEmail = process.env.TO_EMAIL_ADDRESS;
const fromEmail = process.env.FROM_EMAIL_ADDRESS || 'contact@aliajib.com'; // Default, replace with your verified Resend domain email
const hCaptchaSecret = process.env.HCAPTCHA_SECRET_KEY; // Get hCaptcha Secret Key

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  // Destructure hCaptcha token along with form data
  const { user_name, user_email, subject, message, hCaptchaToken } = req.body;

  // Basic validation (include hCaptcha token)
  if (!user_name || !user_email || !subject || !message || !hCaptchaToken) {
    return res.status(400).json({ success: false, message: 'Missing required fields or CAPTCHA token' });
  }

  // --- hCaptcha Verification ---
  if (!hCaptchaSecret) {
    console.error('HCAPTCHA_SECRET_KEY environment variable is not set.');
    return res.status(500).json({ success: false, message: 'Server configuration error (hCaptcha).' });
  }

  try {
    const captchaVerifyResponse = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Send secret key and token as form data
      body: `response=${encodeURIComponent(hCaptchaToken)}&secret=${encodeURIComponent(hCaptchaSecret)}`,
    });

    const captchaData = await captchaVerifyResponse.json();
    console.log('hCaptcha verification response:', captchaData);

    if (!captchaData.success) {
      // Verification failed
      let errorMessage = 'CAPTCHA verification failed.';
      if (captchaData['error-codes'] && captchaData['error-codes'].length > 0) {
        errorMessage += ` Reason: ${captchaData['error-codes'].join(', ')}`;
      }
      return res.status(400).json({ success: false, message: errorMessage });
    }
  } catch (captchaError) {
    console.error('Error verifying hCaptcha:', captchaError);
    return res.status(500).json({ success: false, message: 'Error verifying CAPTCHA.' });
  }
  // --- End hCaptcha Verification ---

  // Sanitize inputs before using them
  const sanitizedName = escapeHtml(user_name);
  const sanitizedEmail = escapeHtml(user_email);
  const sanitizedSubject = escapeHtml(subject);
  const sanitizedMessage = escapeHtml(message);

  if (!toEmail) {
      console.error('TO_EMAIL_ADDRESS environment variable is not set.');
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }
   if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY environment variable is not set.');
      return res.status(500).json({ success: false, message: 'Server configuration error.' });
  }


  try {
    const data = await resend.emails.send({
      from: `Ali Ajib Portfolio <${fromEmail}>`, // Format the 'from' address
      to: [toEmail], // The email address receiving the contact form submissions
      subject: `from your portfolio: ${sanitizedSubject}`,
      reply_to: sanitizedEmail,
      html: `
        <h1>Portfolio Contact Message</h1>
        <p><strong>Name:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Subject:</strong> ${sanitizedSubject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `,
    });

    console.log('Resend response:', data);

    // Check if Resend returned an error object within the data
    if (data.error) {
        console.error('Resend API Error:', data.error);
        return res.status(500).json({ success: false, message: data.error.message || 'Failed to send email via Resend.' });
    }

    // Assuming success if no error is present in the response (Resend might return data even on success)
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Email sending error:', error);
    // Return a generic error message or specific error if available
    const errorMessage = error.message || 'An unexpected error occurred while sending the email.';
    return res.status(500).json({ success: false, message: errorMessage });
  }
} 