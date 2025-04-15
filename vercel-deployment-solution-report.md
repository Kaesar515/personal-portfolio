# Vercel Deployment Troubleshooting Report

## Overview

This report details the step-by-step troubleshooting process undertaken to successfully deploy a React + Vite project (`personal-portfolio`) to Vercel, connect a custom domain (`aliajib.com`), and ensure the functionality of its features (specifically the Resend-based contact form).

The deployment faced several distinct challenges:
1.  Initial build failures related to `i18next` dependencies.
2.  Git synchronization issues (unrelated histories, merge conflicts).
3.  Recurring build failures even after adding dependencies.
4.  Custom domain DNS configuration problems.
5.  Runtime errors (HTTP 500) with the serverless contact form function.

## 1. Initial Build Failure: Missing i18next Dependencies

**Problem:** The initial deployment attempt on Vercel failed during the build step (`npm run build`). The Vercel logs showed errors indicating that Vite/Rollup could not resolve core i18n modules:
```
[vite]: Rollup failed to resolve import "react-i18next" from "/vercel/path0/src/i18n.js".
[vite]: Rollup failed to resolve import "i18next" from "/vercel/path0/src/i18n.js".
```
Crucially, running `npm run build` locally succeeded without errors.

**Investigation:**
*   The discrepancy between local success and Vercel failure strongly suggested a difference in the available `node_modules`.
*   Examination of the project's `package.json` revealed that while i18next *plugins* (`i18next-browser-languagedetector`, `i18next-http-backend`) were listed as dependencies, the core libraries **`i18next`** and **`react-i18next`** were missing.
*   The local build likely worked because these core packages were present in the local `node_modules` folder (perhaps installed previously or pulled in indirectly), masking the omission in `package.json`.
*   Vercel performs a clean install based *only* on `package.json` (and the lock file), so the missing dependencies were not installed in the Vercel build environment.

**Solution Attempt 1:** Explicitly install the missing core dependencies.
```bash
npm install i18next react-i18next --save
```
This added the required packages to the `dependencies` section of `package.json`.

## 2. Git Synchronization Issues

**Problem:** While attempting to push the updated `package.json` and `package-lock.json`, several Git issues arose:
*   `fatal: The current branch master has no upstream branch.` - Fixed by setting the upstream branch: `git push --set-upstream origin master`.
*   `Updates were rejected because the remote contains work that you do not have locally.` - The remote repository had changes not present locally.
*   `fatal: refusing to merge unrelated histories` - Attempting `git pull` failed because the local and remote histories had diverged significantly.

**Investigation & Solution:**
*   The unrelated histories issue was resolved by pulling with the `--allow-unrelated-histories` flag: `git pull origin master --allow-unrelated-histories`.
*   This pull resulted in merge conflicts in `.gitignore`, `package.json`, and `package-lock.json`.
*   Conflicts were resolved manually:
    *   `package.json`: Merged by taking the structure from the remote version and adding the `i18next` and `react-i18next` dependencies from the local version.
    *   `.gitignore`: Resolved by adopting the more comprehensive remote version.
    *   `package-lock.json`: Resolved automatically by running `npm install` after fixing `package.json`.
*   The resolved files were staged (`git add .`) and the merge was completed (`git commit --no-edit`).
*   Finally, `git push origin master` succeeded.

## 3. Recurring Build Failure: Vite Alias Issue

**Problem:** Despite successfully adding `i18next` and `react-i18next` as dependencies and pushing the changes, the subsequent Vercel deployment failed with the *exact same* error:
```
[vite]: Rollup failed to resolve import "react-i18next" from "/vercel/path0/src/i18n.js".
```

**Investigation:**
*   Since the dependencies were confirmed to be in `package.json` and the `npm install` step in Vercel logs completed, the issue was unlikely to be missing packages.
*   Attention turned to the `vite.config.js` file, which contained a specific `resolve.alias` configuration:
    ```javascript
    resolve: {
      alias: {
        i18next: path.resolve(__dirname, 'node_modules/i18next/dist/esm/i18next.js')
      }
    }
    ```
*   The hypothesis was that this alias, while potentially necessary before, might now be interfering with Vite's default module resolution process, especially within the Vercel environment. Modern Vite and i18next versions generally handle ESM resolution correctly via `package.json` exports.

**Solution Attempt 2:** Remove the potentially problematic alias.
*   The entire `resolve` block was removed from `vite.config.js`.
*   The change was committed and pushed (after another `git pull` cycle to integrate new remote changes).

**Outcome:** The subsequent Vercel deployment (`vercel --prod`) **succeeded**, indicating the alias was indeed the cause of the recurring build failure after the dependencies were correctly added.

## 4. Custom Domain Configuration (`aliajib.com`)

**Problem:** Although the site was deployed successfully to the Vercel domain (e.g., `personal-portfolio-*.vercel.app`), it was inaccessible via the custom domain `aliajib.com`.

**Investigation:**
*   Checked the Vercel project settings (**Settings** -> **Domains**). The `aliajib.com` domain showed an "Invalid Configuration" status.
*   Vercel indicated that an **A Record** pointing the root domain (`@`) to `76.76.21.21` was required.
*   Checked the DNS settings at the domain registrar (Porkbun).
*   Identified a conflicting **ALIAS record** for the root domain (`@`) pointing to `uixie.porkbun.com`. DNS rules prevent having both an `ALIAS` (or `CNAME`) and an `A` record for the same host (`@`).

**Solution:** Modify DNS records at Porkbun.
1.  Deleted the conflicting `ALIAS @ uixie.porkbun.com` record.
2.  Added the required `A` record: `A @ 76.76.21.21`.
3.  Added the recommended `CNAME` record for `www`: `CNAME www cname.vercel-dns.com.`.
4.  Saved changes and waited for DNS propagation.

**Outcome:** Vercel eventually detected the correct DNS records, the status changed to "Valid Configuration", and the site became accessible via `aliajib.com`.

## 5. Contact Form Failure (HTTP 500)

**Problem:** After the site was live on the custom domain, submitting the contact form resulted in an error message: "Failed to send message. Please try again later.: HTTP error! status: 500".

**Investigation:**
*   An HTTP 500 error points to a server-side problem, specifically within the `/api/send-message.js` serverless function.
*   Checked the Vercel Function Logs for the `/api/send-message` endpoint.
*   The logs revealed the specific error:
    ```
    Error: Missing API key. Pass it to the constructor `new Resend("re_123")`
    ```
*   This indicated that the `RESEND_API_KEY` environment variable was not available to the function when it tried to initialize the Resend client (`new Resend(process.env.RESEND_API_KEY)`).
*   Initial checks confirmed the code was attempting to access the variable correctly (`process.env.RESEND_API_KEY`).
*   Further investigation revealed that while the necessary environment variables (`RESEND_API_KEY`, `TO_EMAIL_ADDRESS`, `FROM_EMAIL_ADDRESS`, `HCAPTCHA_SECRET_KEY`) were present in the Vercel settings, they were incorrectly scoped **only** to the **Development** environment.

**Solution:** Configure Environment Variables for Production.
1.  Navigated to Vercel project **Settings** -> **Environment Variables**.
2.  Ensured that **all** required variables (`RESEND_API_KEY`, `TO_EMAIL_ADDRESS`, `FROM_EMAIL_ADDRESS`, `HCAPTCHA_SECRET_KEY`, and the frontend `VITE_HCAPTCHA_SITE_KEY`) were present and correctly configured for the **Production** environment (or "All Environments").
3.  Triggered a redeployment on Vercel to ensure the production functions picked up the newly scoped variables.

**Outcome:** After adding the environment variables to the Production scope and redeploying, the contact form functioned correctly on the live site.

## Conclusion

The successful deployment required overcoming several hurdles:

1.  **Dependency Management:** Ensuring all core libraries (`i18next`, `react-i18next`), not just plugins, are explicitly listed in `package.json` is critical for CI/CD environments like Vercel.
2.  **Build Configuration:** Overly specific build configurations (like the Vite alias for `i18next`) can sometimes cause conflicts, especially after dependencies are correctly managed. Removing the unnecessary alias resolved the persistent build issue.
3.  **DNS Configuration:** Custom domains require precise DNS record configuration (A, CNAME) at the registrar, matching Vercel's requirements. Conflicting records (like ALIAS vs. A) must be resolved.
4.  **Environment Variables:** Server-side code (like Vercel Functions) relies heavily on environment variables. These variables *must* be correctly scoped (e.g., set for the **Production** environment) in the Vercel settings to be accessible by the deployed functions. Keys needed only by the backend should *not* have the `VITE_` prefix.

By systematically diagnosing each error using logs (Vercel build logs, Vercel function logs) and checking configurations (`package.json`, `vite.config.js`, Vercel settings, DNS records), each issue was identified and resolved, leading to a fully functional deployment. 