# Security Measures

This document outlines the security measures implemented in this portfolio website project, particularly concerning the contact form functionality.

## 1. Secret Management

Sensitive information such as API keys and specific email addresses are kept out of the codebase and managed securely using environment variables.

*   **Environment Variables:**
    *   Configuration relies on environment variables loaded via `process.env` in the backend API (`/api/send-message.js`).
    *   Required variables include `RESEND_API_KEY`, `TO_EMAIL_ADDRESS`, `FROM_EMAIL_ADDRESS`, and `HCAPTCHA_SECRET_KEY`.
    *   The hCaptcha Site Key, while public, is also managed via an environment variable (`VITE_HCAPTCHA_SITE_KEY`) for consistency, prefixed with `VITE_` as required by Vite for frontend access.
*   **Local Development:**
    *   For local development using `vercel dev`, these variables are ideally sourced from Vercel's development environment settings (added via `vercel env add ... development`).
    *   Alternatively, a `.env.local` file can be used, but this file **must not** be committed.
*   **`.gitignore`:** The `.gitignore` file explicitly ignores `*.local` (covering `.env.local`) and the `.vercel` directory to prevent accidental commits of secrets or project linking information.
*   **`.env.example`:** A `.env.example` file is provided in the repository. This file lists all required environment variables with placeholder values, guiding users on setting up their own configuration without exposing any actual secrets.
*   **Production Deployment (Vercel):** For the live deployment, these same environment variables must be configured securely within the Vercel project settings (for the Production environment).

## 2. Contact Form Spam Prevention (hCaptcha)

To prevent automated spam submissions through the contact form:

*   **hCaptcha Integration:** The form uses [hCaptcha](https://hcaptcha.com/).
    *   **Frontend:** The `@hcaptcha/react-hcaptcha` component is integrated into the contact form. It requires the `VITE_HCAPTCHA_SITE_KEY` environment variable to render. The user must solve the CAPTCHA challenge, which generates a verification token.
    *   **Backend:** The generated token is sent along with the form data to the `/api/send-message.js` endpoint. The backend API uses the `HCAPTCHA_SECRET_KEY` environment variable to make a server-to-server request to the hCaptcha API (`https://api.hcaptcha.com/siteverify`) to validate the token. The email is only sent via Resend if hCaptcha verification is successful.

## 3. Input Sanitization (Backend)

To mitigate the risk of Cross-Site Scripting (XSS) attacks where malicious HTML or scripts could be injected into the emails sent by the form:

*   **HTML Escaping:** The `/api/send-message.js` backend function takes all user-provided input (`user_name`, `user_email`, `subject`, `message`) and escapes potentially harmful HTML characters (`&`, `<`, `>`, `"`, `'`) before embedding them into the HTML email body sent via Resend. This ensures user input is treated as plain text within the email content.

## 4. Secure Backend Function

*   **Serverless API:** The email sending and CAPTCHA verification logic resides in a serverless function (`/api/send-message.js`). This keeps sensitive operations off the client-side.
*   **No Secret Exposure:** The API function does not expose any API keys (Resend, hCaptcha Secret) or sensitive configuration in its responses to the client. Error messages are designed to be informative for debugging without revealing internal details.

## 5. Potential Future Enhancements

*   **Server-Side Rate Limiting:** Implementing rate limiting on the `/api/send-message.js` endpoint (e.g., based on IP address) could add an additional layer of defense against high-volume manual or automated attacks that might bypass CAPTCHA. Vercel offers some built-in security features, but specific rate limiting might require additional logic or configuration.

---

This summary provides an overview of the key security considerations addressed in the project. Remember to always keep your API keys and secrets confidential. 