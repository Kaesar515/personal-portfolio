# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Project Setup

1.  Install dependencies:
    ```bash
    npm install
    # or yarn install or pnpm install
    ```

2.  **Environment Variables:**
    This project uses environment variables for configuring the contact form email service (Resend) and hCaptcha.

    *   Copy the example environment file:
        ```bash
        cp .env.example .env.local
        ```
    *   Edit the `.env.local` file and fill in your actual values:
        *   `RESEND_API_KEY`: Your API key from Resend.com.
        *   `TO_EMAIL_ADDRESS`: The email address where you want to receive contact messages.
        *   `FROM_EMAIL_ADDRESS`: The email address used to send emails (must be from a domain verified in your Resend account, e.g., `noreply@your-verified-domain.com`).
        *   `VITE_HCAPTCHA_SITE_KEY`: Your hCaptcha Site Key (must start with `VITE_` for frontend access).
        *   `HCAPTCHA_SECRET_KEY`: Your hCaptcha Secret Key.

    *Note: `.env.local` is included in `.gitignore` and should not be committed.* 

3.  Run the development server:
    *   **Using Vite Dev Server (for frontend only):**
        ```bash
        npm run dev
        ```
    *   **Using Vercel Dev Server (recommended for testing API routes like the contact form):**
        Install Vercel CLI: `npm install -g vercel`
        ```bash
        vercel dev
        ```
        (Follow prompts to link the project if you haven't already. This command also uses the `.env.local` file.)

## Contact Form Setup (Resend)

The contact form uses [Resend](https://resend.com/) to send emails via a serverless function (`/api/send-message.js`). It also includes spam protection using [hCaptcha](https://hcaptcha.com/). To make it work, you need to:

1.  Sign up for a Resend account.
2.  Verify a domain (e.g., `yourdomain.com` or `mail.yourdomain.com`).
3.  Generate an API key.
4.  **hCaptcha Setup:**
    1. Sign up for an hCaptcha account.
    2. Create a new Site and note the **Site Key** and **Secret Key**.
5.  Provide the Resend and hCaptcha keys and email addresses in the environment variables as described above.

## Deployment (Vercel)

To deploy this project to Vercel:

1.  Connect your Git repository (GitHub, GitLab, Bitbucket) to Vercel.
2.  Configure the same environment variables (`RESEND_API_KEY`, `TO_EMAIL_ADDRESS`, `FROM_EMAIL_ADDRESS`, `HCAPTCHA_SECRET_KEY`, `VITE_HCAPTCHA_SITE_KEY`) in your Vercel project settings (under the "Environment Variables" section for the Production environment).
3.  Push your code to trigger a deployment.

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](./LICENSE).

See the [LICENSE](./LICENSE) file for details. In summary:
- You **must** give appropriate credit (BY).
- You **may not** use the material for commercial purposes (NC).
- If you remix, transform, or build upon the material, you **must** distribute your contributions under the same license (SA).

Please give appropriate credit by linking back to [aliajib.com](https://aliajib.com) if you use or adapt this code.

---

*Original Vite README content below:* 

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
