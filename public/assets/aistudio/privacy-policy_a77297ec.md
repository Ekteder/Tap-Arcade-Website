# Privacy Policy — Tap Arcade

> **Note:** This document is hosted at `[PLACEHOLDER: https://yourusername.github.io/tap-arcade/privacy-policy]` — replace this URL with your actual GitHub Pages URL before publishing.

**Last Updated:** October 2026

---

## Introduction

Welcome to **Tap Arcade**, developed by **[PLACEHOLDER: Your Studio Name]** ("we," "us," or "our"). This Privacy Policy explains how we collect, use, store, and protect information when you use the Tap Arcade mobile application ("App") on Android devices.

By downloading and using Tap Arcade, you agree to the practices described in this policy. If you do not agree with this policy, please do not use the App.

This policy applies to all users of Tap Arcade distributed through the Google Play Store under the package ID `[PLACEHOLDER: com.yourstudio.taparcade]`.

---

## Information We Collect

### Information You Provide via Google Sign-In

Tap Arcade requires a Google account to use. When you sign in, we collect:

- Your **Google account email address**
- A **Firebase User ID (UID)** assigned by Firebase Authentication (Google LLC)

This information is necessary to create and maintain your account and to associate your game progress and entitlements with your identity.

### Server-Side Game Data (Cloud Firestore)

The following data is stored on our secure Firebase Cloud Firestore database:

- **Diamond balance** — the number of in-game diamonds associated with your account
- **Premium theme ownership** — which premium cosmetic themes you have unlocked via purchase
- **Purchase records** — stored in a `diamond_purchases` collection, including: Google Play Order ID (GPA.xxxx format), product ID, number of diamonds granted, and your email address. This data is retained for financial and audit integrity.

### On-Device Data (Local Storage Only)

The following data is stored **only on your device** using Jetpack DataStore and is **never transmitted to our servers**:

- Coin balance and coin-tier theme ownership
- Equipped theme preference
- Gameplay statistics (personal best score, total completed games, total playtime)
- Sound effects preference (on/off)

This local data is not accessible to us and is permanently lost if you uninstall the App or clear its data.

### What We Do NOT Collect

We do **not** collect:

- Advertising IDs or device identifiers for advertising purposes
- Precise or approximate location data
- Camera, microphone, or contacts data
- Behavioral profiling or cross-app tracking data
- Any data through third-party analytics or crash-reporting SDKs beyond standard Firebase infrastructure

---

## How We Use Your Information

We use the information we collect to:

- **Authenticate** your identity and provide secure access to the App
- **Synchronize** your diamond balance and owned premium themes across sessions
- **Verify and fulfil** in-app purchases via the Google Play Developer API
- **Maintain purchase records** for financial accountability and tax/audit compliance
- **Improve the App** using aggregate, non-identifiable usage patterns (no individual profiling)

We do **not** sell, rent, or share your personal information with third parties for advertising or marketing purposes.

---

## Data Storage and Security

Your server-side data is stored on **Firebase Cloud Firestore**, a service operated by Google LLC, with servers located primarily in the United States. Firebase infrastructure employs industry-standard security measures including encryption in transit (TLS) and at rest.

We implement reasonable technical and organizational safeguards to protect your data. However, no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.

Tap Arcade requires an active internet connection at all times. There is no offline or guest mode.

---

## Third-Party Services

Tap Arcade uses the following third-party services provided by **Google LLC**:

| Service | Purpose |
|---|---|
| **Firebase Authentication** | Secure Google Sign-In and account management |
| **Firebase Cloud Firestore** | Server-side storage of account and entitlement data |
| **Firebase Cloud Functions** | Backend processing logic (e.g., purchase verification) |
| **Google Play Billing** | Processing and verifying in-app purchases |

Each of these services is governed by [Google's Privacy Policy](https://policies.google.com/privacy). We encourage you to review it.

---

## In-App Purchases

Tap Arcade offers optional **diamond pack** purchases (consumable, one-time — no subscriptions or recurring billing). Diamonds are used exclusively to unlock cosmetic themes and confer no gameplay advantages.

All payment transactions are processed by **Google Play Billing**. We do not collect or store your payment card details. Purchase verification is performed server-side via the Google Play Developer API to ensure secure and accurate delivery of purchased items.

Purchase records (Order ID, product ID, diamonds granted, and your email) are retained in our database for financial and tax/audit purposes even after account deletion, with your personally identifiable information removed as described below.

---

## Your Rights and Choices

### Accessing and Updating Your Data

Your diamond balance and owned themes are visible within the App. Gameplay statistics are stored locally on your device and visible in-app.

### Deleting Your Account

You may permanently delete your Tap Arcade account at any time from the **Profile screen** within the App. Account deletion requires re-authentication for security purposes.

Upon deletion:

- Your Firestore user document and account data are permanently deleted
- Your Firebase Authentication account is removed
- Purchase records are **anonymized**: your email address is removed and your UID is pseudonymized. Google Play Order IDs and transaction amounts are **retained** for tax and financial audit compliance
- Local device data is cleared when you uninstall the App

We will process deletion requests promptly. Because purchase ledger records are retained in anonymized form, some data may persist in our systems for legal compliance purposes as described above.

---

## Children's Privacy

Tap Arcade is **not directed at children under the age of 13**. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately at the address below and we will take steps to delete it promptly.

---

## Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this document. For material changes, we will provide notice via the App or the Play Store listing. Your continued use of Tap Arcade after any changes constitutes your acceptance of the revised policy.

---

## Contact Us

If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us at:

**[PLACEHOLDER: Your Studio Name]**
Email: **[PLACEHOLDER: your-email@example.com]**

---

*This Privacy Policy is provided for informational purposes and does not constitute legal advice. We recommend consulting a qualified legal professional to ensure compliance with all applicable laws and regulations in your jurisdiction.*
