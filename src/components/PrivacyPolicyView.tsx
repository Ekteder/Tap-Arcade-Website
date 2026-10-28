import React from 'react';
import { ArrowLeft, ExternalLink, Shield, Trash2 } from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface PrivacyPolicyViewProps {
  onBackToHome: () => void;
  onNavigateDeleteAccount: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  onBackToHome,
  onNavigateDeleteAccount,
}) => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-[920px] mx-auto px-6">
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBackToHome();
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#22252A] hover:text-[#4A90E2] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {SITE_CONFIG.appName} Overview</span>
          </a>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/delete-account"
              onClick={(e) => {
                e.preventDefault();
                onNavigateDeleteAccount();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#22252A] text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Account Deletion Guide</span>
            </a>
          </div>
        </div>

        {/* Document Header */}
        <div className="py-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mb-3">
            <span>Google Play Store Compliance Document</span>
            <span aria-hidden="true">·</span>
            <span>Package ID: {SITE_CONFIG.packageId}</span>
            <span aria-hidden="true">·</span>
            <span>Last Updated: {SITE_CONFIG.privacyPolicyUpdated}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#22252A]">
            Privacy Policy — {SITE_CONFIG.appName}
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Developer &amp; Publisher: <strong className="text-[#22252A]">{SITE_CONFIG.developerName}</strong> · Application:{' '}
            <strong className="text-[#22252A]">{SITE_CONFIG.appName}</strong> (
            <code className="font-mono text-xs">{SITE_CONFIG.packageId}</code>) · Platform: {SITE_CONFIG.minAndroidVersion}
          </p>
        </div>

        {/* Unabridged Legal Content */}
        <article className="py-8 space-y-10 text-[15px] text-slate-700 leading-relaxed">
          {/* 1. Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#22252A]">
              1. Introduction &amp; Scope
            </h2>
            <p>
              Welcome to <strong className="text-[#22252A]">{SITE_CONFIG.appName}</strong>, developed by{' '}
              <strong className="text-[#22252A]">{SITE_CONFIG.developerName}</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). This Privacy Policy explains how we collect, use, store, and protect information when you use the {SITE_CONFIG.appName} mobile application (&ldquo;App&rdquo;) on Android devices.
            </p>
            <p>
              By downloading and using {SITE_CONFIG.appName}, you agree to the practices described in this policy. If you do not agree with this policy, please do not use the App. This policy applies to all users of {SITE_CONFIG.appName} distributed through the Google Play Store under the package ID{' '}
              <code className="font-mono text-xs bg-[#F4F6F8] px-1.5 py-0.5 rounded border border-slate-200">
                {SITE_CONFIG.packageId}
              </code>.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#22252A]">
              2. Information We Collect
            </h2>

            <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-[#22252A]">
                A. Information You Provide via Google Sign-In
              </h3>
              <p className="text-sm">
                {SITE_CONFIG.appName} is an online-validated application that requires a Google account to use via Android Credential Manager and Firebase Authentication. When you sign in, we collect:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>
                  Your <strong className="text-[#22252A]">Google account email address</strong>
                </li>
                <li>
                  A <strong className="text-[#22252A]">Firebase User ID (UID)</strong> assigned by Firebase Authentication (Google LLC)
                </li>
              </ul>
              <p className="text-xs text-slate-600">
                This information is necessary to create and maintain your account and to associate your diamond balance and premium theme entitlements with your identity.
              </p>
            </div>

            <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-[#22252A]">
                B. Server-Side Game Data (Cloud Firestore)
              </h3>
              <p className="text-sm">
                The following data is stored on our secure Firebase Cloud Firestore database:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1.5">
                <li>
                  <strong className="text-[#22252A]">Diamond balance (<code className="font-mono text-xs">diamondBalance</code>)</strong> — the authoritative integer number of in-game diamonds associated with your account in <code className="font-mono text-xs">users/&#123;uid&#125;</code>.
                </li>
                <li>
                  <strong className="text-[#22252A]">Premium theme ownership (<code className="font-mono text-xs">ownedPremiumThemes</code>)</strong> — the list of premium cosmetic themes you have unlocked.
                </li>
                <li>
                  <strong className="text-[#22252A]">Immutable purchase &amp; transaction records</strong> — stored in <code className="font-mono text-xs">diamond_purchases/&#123;purchaseTokenHash&#125;</code> and <code className="font-mono text-xs">theme_transactions/&#123;operationId&#125;</code>, including Google Play Order ID (<code className="font-mono text-xs">GPA.xxxx</code> format), product ID, SHA-256 purchase token hash, number of diamonds granted or spent, timestamp, and your email address. This data is retained for idempotency, fraud prevention, and financial/tax audit integrity.
                </li>
              </ul>
            </div>

            <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 space-y-3">
              <h3 className="text-base font-bold text-[#22252A]">
                C. On-Device Local Data (Jetpack DataStore Only)
              </h3>
              <p className="text-sm">
                The following data is stored <strong className="text-[#22252A]">exclusively on your device</strong> using Android Jetpack DataStore (Preferences), scoped by your Firebase UID, and is <strong className="text-[#22252A]">never transmitted to our servers</strong>:
              </p>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Local Coin balance and Coin-tier theme ownership (<code className="font-mono text-xs">Mint</code>, <code className="font-mono text-xs">Sunset</code>, <code className="font-mono text-xs">Ocean</code>)</li>
                <li>Currently equipped theme preference (<code className="font-mono text-xs">equippedThemeId</code>)</li>
                <li>Gameplay career statistics (<code className="font-mono text-xs">personalBestScore</code>, <code className="font-mono text-xs">totalCompletedGames</code>, <code className="font-mono text-xs">totalCompletedPlaytimeSeconds</code>)</li>
                <li>Sound effects preference (enabled/disabled toggle)</li>
              </ul>
              <p className="text-xs text-slate-600">
                This local data is not accessible to {SITE_CONFIG.developerName} and is permanently erased if you delete your account in-app, uninstall the App, or clear its local storage.
              </p>
            </div>
          </section>

          {/* 3. What We Do NOT Collect */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#22252A]">
              3. What We Do NOT Collect
            </h2>
            <p>
              {SITE_CONFIG.appName} is 100% ad-free and privacy-minimal. We do <strong className="text-[#22252A]">not</strong> collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>Advertising IDs (AAID / GAID) or device identifiers for advertising or monetization</li>
              <li>Precise or approximate GPS / network location data</li>
              <li>Camera, microphone, photo library, or contacts data</li>
              <li>Behavioral profiling or cross-app tracking data</li>
              <li>Any data through third-party advertising networks or behavioral analytics SDKs</li>
            </ul>
          </section>

          {/* 4. How We Use Your Information */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#22252A]">
              4. How We Use Your Information
            </h2>
            <p>We use the information we collect strictly to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>
                <strong className="text-[#22252A]">Authenticate</strong> your identity via Google Sign-In and provide secure access to the App
              </li>
              <li>
                <strong className="text-[#22252A]">Synchronize</strong> your diamond balance and owned premium themes across sessions and devices
              </li>
              <li>
                <strong className="text-[#22252A]">Verify and fulfill</strong> consumable in-app diamond purchases via Google Play Billing and atomic Firestore transactions
              </li>
              <li>
                <strong className="text-[#22252A]">Maintain purchase records</strong> for financial accountability, idempotency, and mandatory tax/audit compliance
              </li>
            </ul>
            <p className="text-sm">
              We do <strong className="text-[#22252A]">not</strong> sell, rent, or share your personal information with third parties for advertising or marketing purposes.
            </p>
          </section>

          {/* 5. Data Storage & Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-[#22252A]">
              5. Data Storage, Security &amp; Third-Party Services (Google LLC)
            </h2>
            <p>
              Your server-side data is stored on <strong className="text-[#22252A]">Firebase Cloud Firestore</strong>, operated by Google LLC, employing encryption in transit (TLS) and encryption at rest. {SITE_CONFIG.appName} uses only the following first-party infrastructure services provided by <strong className="text-[#22252A]">Google LLC</strong>:
            </p>

            <div className="overflow-x-auto bg-[#F4F6F8] rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-mono text-slate-500">
                    <th className="py-3 px-4">Service Provider</th>
                    <th className="py-3 px-4">Purpose in {SITE_CONFIG.appName}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#22252A]">Firebase Authentication</td>
                    <td className="py-3 px-4 text-slate-600">Secure Google Sign-In (Credential Manager) &amp; account lifecycle management</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#22252A]">Firebase Cloud Firestore</td>
                    <td className="py-3 px-4 text-slate-600">Owner-isolated storage of diamond balance, premium theme entitlements, and receipt ledgers</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#22252A]">Firebase Cloud Functions</td>
                    <td className="py-3 px-4 text-slate-600">Serverless backend purchase verification and account lifecycle processing</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-[#22252A]">Google Play Billing</td>
                    <td className="py-3 px-4 text-slate-600">Processing and consuming optional one-time diamond packs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm">
              Each of these services is governed by{' '}
              <a
                href={SITE_CONFIG.googlePrivacyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#4A90E2] font-semibold underline inline-flex items-center gap-1"
              >
                <span>Google&apos;s Privacy Policy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>.
            </p>
          </section>

          {/* 6. In-App Purchases */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#22252A]">
              6. In-App Purchases
            </h2>
            <p>
              {SITE_CONFIG.appName} offers six optional <strong className="text-[#22252A]">diamond pack</strong> purchases (<code className="font-mono text-xs">taparcade_diamonds_70</code> through <code className="font-mono text-xs">taparcade_diamonds_2000</code>). All packs are consumable, one-time purchases with no subscriptions or recurring billing. Diamonds are used exclusively to unlock cosmetic themes and confer zero gameplay advantages.
            </p>
            <p>
              All payment transactions are processed directly by <strong className="text-[#22252A]">Google Play Billing</strong>. {SITE_CONFIG.developerName} never sees, collects, or stores your credit card, debit card, or banking details.
            </p>
          </section>

          {/* 7. Your Rights & Account Deletion */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#22252A]">
              7. Your Rights &amp; In-App Account Deletion
            </h2>
            <p>
              You may permanently delete your {SITE_CONFIG.appName} account at any time directly inside the App via <strong className="text-[#22252A]">Profile → Account Actions → Delete Account</strong>. Account deletion requires re-authentication via Google Credential Manager for security purposes.
            </p>
            <p>Upon account deletion:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li>
                Your Cloud Firestore user document (<code className="font-mono text-xs">users/&#123;uid&#125;</code>, including email, diamond balance, and owned premium themes) is <strong className="text-[#22252A]">permanently deleted immediately</strong>.
              </li>
              <li>
                Your <strong className="text-[#22252A]">Firebase Authentication record</strong> is permanently deleted immediately.
              </li>
              <li>
                All 7 UID-namespaced local keys in <strong className="text-[#22252A]">Jetpack DataStore</strong> are wiped immediately on in-app deletion (or upon app uninstall).
              </li>
              <li>
                Historical purchase audit records (<code className="font-mono text-xs">diamond_purchases</code> &amp; <code className="font-mono text-xs">theme_transactions</code>) are <strong className="text-[#22252A]">anonymized</strong>: your <code className="font-mono text-xs">userEmail</code> is replaced with <code className="font-mono text-xs">&quot;[DELETED]&quot;</code> and your <code className="font-mono text-xs">uid</code> is replaced with an irreversible SHA-256 pseudonymized hash while non-PII transaction amounts and product IDs are retained for mandatory tax and financial audit compliance.
              </li>
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateDeleteAccount}
                className="px-4 py-2.5 rounded-xl bg-[#D9381E] text-white text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
              >
                View Step-by-Step Account Deletion Guide →
              </button>
            </div>
          </section>

          {/* 8. Children's Privacy & Changes */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#22252A]">
              8. Children&apos;s Privacy &amp; Policy Updates
            </h2>
            <p>
              {SITE_CONFIG.appName} is <strong className="text-[#22252A]">not directed at children under the age of 13</strong>. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately so we can delete it promptly.
            </p>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last Updated&rdquo; date at the top of this page.
            </p>
          </section>

          {/* 9. Contact Information */}
          <section className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <Shield className="w-4 h-4 text-[#4A90E2]" />
              <span>Official Developer Contact</span>
            </div>
            <h2 className="text-lg font-bold text-[#22252A]">
              9. Contact Us
            </h2>
            <p className="text-sm text-slate-600">
              If you have questions, concerns, or data requests regarding this Privacy Policy or {SITE_CONFIG.appName} (<code className="font-mono text-xs">{SITE_CONFIG.packageId}</code>), please contact:
            </p>
            <div className="text-sm font-mono text-[#22252A] pt-1 space-y-1">
              <p>Studio / Developer: {SITE_CONFIG.developerName}</p>
              <p>
                Support &amp; Privacy Email:{' '}
                <a
                  href={`mailto:${SITE_CONFIG.supportEmail}?subject=${encodeURIComponent(
                    `${SITE_CONFIG.appName} Privacy Inquiry (${SITE_CONFIG.packageId})`
                  )}`}
                  className="text-[#4A90E2] underline"
                >
                  {SITE_CONFIG.supportEmail}
                </a>
              </p>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};
