# Vercel Deployment Troubleshooting Report

**Project:** personal-portfolio (`pweb/client`)
**Date:** August 31, 2024

## Summary of Issue

The project builds successfully locally using `npm run build` (via Vite), but consistently fails during deployment builds on Vercel. The specific error encountered repeatedly in Vercel build logs is:

```
[vite]: Rollup failed to resolve import "i18next" from "/vercel/path0/src/i18n.js".
```

This indicates an issue with module resolution specifically within the Vercel build environment, despite the necessary dependencies (`i18next`, `react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`) being correctly listed in `package.json` and present in `package-lock.json`.

## Troubleshooting Steps Taken

The following steps were taken in an attempt to resolve the Vercel build failure:

1.  **Confirmed Local Build Success:** Verified that `npm run build` completes without errors on the local development machine.
2.  **Installed Dependencies:** Ensured `i18next` and related packages (`react-i18next`, `i18next-http-backend`, `i18next-browser-languagedetector`) were explicitly installed and added to `package.json`. Pushed updated `package.json` and `package-lock.json`.
    *   *Outcome:* Vercel build still failed with the same error.
3.  **Specified Node.js Version:** Checked local Node.js version (`v22.14.0`). Added an `engines` field to `package.json` specifying `"node": ">=22.0.0"` to ensure Vercel uses a compatible version. Pushed update.
    *   *Outcome:* Vercel build still failed with the same error.
4.  **Cleared Vercel Build Cache:** Cleared the build cache via the Vercel project settings dashboard and triggered a redeploy.
    *   *Outcome:* Vercel build still failed with the same error.
5.  **Externalized Dependency (Workaround Attempt):** Added `build.rollupOptions.external: ['i18next']` to `vite.config.js` as suggested by the error message. Pushed update.
    *   *Outcome:* Vercel build still failed with the same error. Configuration was reverted.
6.  **Regenerated Lockfile:** Deleted local `node_modules` and `package-lock.json`. Ran `npm install` to generate a fresh `package-lock.json`. Pushed the new lockfile.
    *   *Outcome:* Vercel build still failed with the same error.
7.  **Attempted Manual Deployments:** Used `vercel --prod` multiple times after configuration changes; builds consistently failed with the same error.
8.  **Checked `src/i18n.js`:** Reviewed the import statement (`import i18n from 'i18next';`) and initialization logic; no obvious errors found.

## Current Status

The deployment build on Vercel continues to fail due to the inability to resolve the `i18next` module, despite it being correctly configured and building successfully locally. The root cause appears specific to the Vercel build environment interaction with this dependency or project setup.

## Next Recommended Steps

1.  **Deep Log Analysis:** Scrutinize the failed Vercel build logs again for any preceding warnings or subtle errors that might provide more context.
2.  **Temporary Simplification:** Temporarily comment out i18next plugin usage (e.g., `.use(HttpApi)`, `.use(LanguageDetector)`) in `src/i18n.js`, commit, push, and see if the build passes on Vercel to isolate the issue.
3.  **Contact Vercel Support/Community:** Provide Vercel support or their community forums with the GitHub repository link, failed deployment logs link, and a summary of the issue and troubleshooting steps taken. 