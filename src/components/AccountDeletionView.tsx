import React from 'react';
import {
  ArrowLeft,
  Smartphone,
  FileText,
  Shield,
} from 'lucide-react';
import { SITE_CONFIG } from '../config/siteConfig';

interface AccountDeletionViewProps {
  onBackToHome: () => void;
  onNavigatePrivacy: () => void;
}

export const AccountDeletionView: React.FC<AccountDeletionViewProps> = ({
  onBackToHome,
  onNavigatePrivacy,
}) => {
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-[920px] mx-auto px-6">
        {/* Top Navigation */}
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
              href="/privacy"
              onClick={(e) => {
                e.preventDefault();
                onNavigatePrivacy();
              }}
              className="px-3.5 py-2 rounded-xl bg-[#22252A] text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Privacy Policy</span>
            </a>
          </div>
        </div>

        {/* Compliance Page Header */}
        <div className="py-8 border-b border-slate-200">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 mb-3">
            <span>Google Play Data Safety Compliance</span>
            <span aria-hidden="true">·</span>
            <span>Package ID: {SITE_CONFIG.packageId}</span>
            <span aria-hidden="true">·</span>
            <span>Developer: {SITE_CONFIG.developerName}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#22252A]">
            Account &amp; Data Deletion — {SITE_CONFIG.appName}
          </h1>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed max-w-3xl">
            In compliance with Google Play&apos;s User Data &amp; Account Deletion policy, this page explains how players of{' '}
            <strong className="text-[#22252A]">{SITE_CONFIG.appName}</strong> (
            <code className="font-mono text-xs">{SITE_CONFIG.packageId}</code>) developed by{' '}
            <strong className="text-[#22252A]">{SITE_CONFIG.developerName}</strong> can permanently delete their account and associated data directly inside the Android application.
          </p>
        </div>

        {/* Instant In-App Account Deletion Guide */}
        <div className="py-10">
          <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-700 font-semibold">
                In-App Self-Service Deletion · Instant Execution
              </span>
              <Smartphone className="w-5 h-5 text-[#10B981]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#22252A]">
                How to Permanently Delete Your Account In-App
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                Account deletion is built directly into the {SITE_CONFIG.appName} Android app so that your identity is verified via Google Credential Manager before permanently erasing your records:
              </p>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
              {[
                {
                  step: '01',
                  title: `Open ${SITE_CONFIG.appName} on Android`,
                  detail: 'Ensure your device is connected to the internet and signed in with the Google account you wish to delete.',
                },
                {
                  step: '02',
                  title: 'Navigate to the Profile Tab',
                  detail: 'Tap the Profile icon in the bottom-right corner of the navigation bar.',
                },
                {
                  step: '03',
                  title: 'Scroll to Account Actions',
                  detail: 'Locate the Account Actions section at the bottom of the Profile screen.',
                },
                {
                  step: '04',
                  title: 'Tap "Delete Account"',
                  detail: 'Initiate the permanent account deletion sequence.',
                },
                {
                  step: '05',
                  title: 'Confirm Step 1 & Step 2 Warnings',
                  detail: 'Acknowledge that your Diamond balance and unlocked Premium Themes will be permanently forfeited.',
                },
                {
                  step: '06',
                  title: 'Re-Authenticate with Google Credential Manager',
                  detail:
                    'Verify ownership of your Google account. Your Cloud Firestore user document, Firebase Auth record, and all 7 UID-scoped local Jetpack DataStore keys are wiped immediately.',
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3"
                >
                  <span className="font-mono font-bold text-[#4A90E2] shrink-0 text-sm">
                    {item.step}.
                  </span>
                  <div>
                    <p className="font-bold text-[#22252A] text-sm">{item.title}</p>
                    <p className="text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Mandatory Google Play Data Safety Deletion & Retention Table */}
        <div className="py-8 border-t border-slate-200">
          <p className="text-xs font-mono text-slate-500 mb-2">
            Google Play Data Safety Standard · Retention &amp; Anonymization Schedule
          </p>
          <h2 className="text-2xl font-bold text-[#22252A] mb-4">
            Data Deletion vs. Anonymized Retention Summary
          </h2>

          <div className="overflow-x-auto bg-[#F4F6F8] rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-mono text-slate-500">
                  <th className="py-3.5 px-4">Data Category &amp; Location</th>
                  <th className="py-3.5 px-4">Specific Fields Included</th>
                  <th className="py-3.5 px-4">Deletion Action &amp; Retention Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#22252A]">
                    Cloud Firestore: users/&#123;uid&#125;
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    Google Email, Firebase UID, Diamond Balance (<code className="font-mono">diamondBalance</code>), Owned Premium Themes (<code className="font-mono">ownedPremiumThemes</code>)
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">
                    Permanently Deleted Immediately
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#22252A]">
                    Firebase Authentication Record
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    Google OAuth Credential Link, Account Email, Firebase Auth UID
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">
                    Permanently Deleted Immediately
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#22252A]">
                    Local Jetpack DataStore (On-Device)
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    7 UID-Scoped Keys: Coins, Coin Themes, Equipped Theme, Personal Best, Completed Games, Total Playtime, Sound Toggle
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">
                    Wiped Immediately on In-App Delete / Uninstalled
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-[#22252A]">
                    diamond_purchases &amp; theme_transactions Ledgers
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    Google Play Order ID (<code className="font-mono">GPA.xxxx</code>), Product SKU, SHA-256 Token Hash, Timestamp
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-700">
                    <strong className="text-[#22252A]">Anonymized Immediately:</strong>{' '}
                    <code className="font-mono">userEmail</code> replaced with{' '}
                    <code className="font-mono">&quot;[DELETED]&quot;</code> and <code className="font-mono">uid</code> replaced with irreversible SHA-256 hash; non-PII transaction amounts and SKUs retained for mandatory tax/financial audit compliance.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Support Contact Box */}
        <section className="mt-6 bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <Shield className="w-4 h-4 text-[#4A90E2]" />
            <span>Player Support &amp; Data Inquiries</span>
          </div>
          <h2 className="text-lg font-bold text-[#22252A]">
            Need Assistance?
          </h2>
          <p className="text-sm text-slate-600">
            If you need help with your {SITE_CONFIG.appName} account or have questions about data deletion, contact{' '}
            <strong className="text-[#22252A]">{SITE_CONFIG.developerName}</strong> directly at:
          </p>
          <p className="text-sm font-mono text-[#22252A] pt-1">
            Email:{' '}
            <a
              href={`mailto:${SITE_CONFIG.supportEmail}?subject=${encodeURIComponent(
                `${SITE_CONFIG.appName} Support Inquiry (${SITE_CONFIG.packageId})`
              )}`}
              className="text-[#4A90E2] underline"
            >
              {SITE_CONFIG.supportEmail}
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};
