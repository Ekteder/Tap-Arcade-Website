import React, { useState } from 'react';
import { HardDrive, Cloud, ShieldCheck, ChevronDown, FileText, Trash2 } from 'lucide-react';
import { DIAMOND_PACKS, SUPPORT_FAQS } from '../data/tapArcadeData';

interface FairPlayEconomySectionProps {
  onNavigateCompliance: (page: 'privacy' | 'delete-account') => void;
}

export const FairPlayEconomySection: React.FC<FairPlayEconomySectionProps> = ({
  onNavigateCompliance,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section id="fair-play" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-mono text-slate-500 mb-2">
            04. Ethical Economy &amp; Storage Architecture · Zero Pay-to-Win
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#22252A] text-balance">
            Strict Local vs. Cloud Storage Separation
          </h2>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            Tap Arcade separates skill-earned local progression from server-verified cosmetic entitlements.
            There are no advertisements, no tracking SDKs, no energy timers, and zero gameplay advantages sold for money.
          </p>
        </div>

        {/* 2-Column Architectural Split: Jetpack DataStore vs Cloud Firestore */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-12">
          {/* Column 1: Local-Only Data (Jetpack DataStore) */}
          <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">
                  On-Device Persistence · LocalDataStore.kt
                </span>
                <HardDrive className="w-5 h-5 text-[#10B981]" />
              </div>

              <h3 className="text-xl font-bold text-[#22252A]">
                Local-Only Data (Jetpack DataStore, UID-Namespaced)
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Stored strictly on your Android device and scoped by your authenticated Firebase{' '}
                <code className="font-mono text-xs">uid</code> so local records never leak across accounts on shared hardware.
              </p>

              <div className="mt-6 space-y-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#22252A]">
                      Coins &amp; Coin-Tier Themes
                    </span>
                    <span className="text-xs font-mono text-emerald-700">
                      1 Pt = 1 Coin
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Earned exclusively in completed runs. Unlocks <strong className="text-[#22252A]">Mint (300)</strong>,{' '}
                    <strong className="text-[#22252A]">Sunset (500)</strong>, and{' '}
                    <strong className="text-[#22252A]">Ocean (800)</strong> with atomic local mutex protection.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#22252A]">
                      Career Gameplay Statistics &amp; Preferences
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      7 Scoped Keys
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Includes <code className="font-mono">personalBestScore</code>,{' '}
                    <code className="font-mono">totalCompletedGames</code>,{' '}
                    <code className="font-mono">totalCompletedPlaytimeSeconds</code> (formatted as{' '}
                    <code className="font-mono">Xh Ym Zs</code>), equipped theme ID, and sound preference.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200/80 text-xs font-mono text-slate-500">
              Never transmitted to any server · Cleared on account deletion or uninstall.
            </div>
          </div>

          {/* Column 2: Account-Synced Data (Cloud Firestore Atomic Transactions) */}
          <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-500">
                  Server-Authoritative Ledger · Cloud Firestore
                </span>
                <Cloud className="w-5 h-5 text-[#4A90E2]" />
              </div>

              <h3 className="text-xl font-bold text-[#22252A]">
                Account-Synced Data (Cloud Firestore Atomic Transactions)
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Synchronized across your Android devices via owner-isolated Firestore rules (
                <code className="font-mono text-xs">asia-southeast1</code>) and idempotent{' '}
                <code className="font-mono text-xs">runTransaction</code> blocks.
              </p>

              <div className="mt-6 space-y-3">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#22252A]">
                      Diamonds &amp; 9 Premium Cosmetic Themes
                    </span>
                    <span className="text-xs font-mono text-[#4A90E2]">
                      users/&#123;uid&#125;
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Stores authoritative <code className="font-mono">diamondBalance</code> and{' '}
                    <code className="font-mono">ownedPremiumThemes</code> array. 100% cosmetic—confers zero score multipliers or extra lives.
                  </p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#22252A]">
                      Idempotent Receipt &amp; Theme Ledgers
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      SHA-256 Token Hash
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Every purchase token is hashed via SHA-256 in{' '}
                    <code className="font-mono">diamond_purchases/&#123;hash&#125;</code> and{' '}
                    <code className="font-mono">theme_transactions/&#123;opId&#125;</code> before calling{' '}
                    <code className="font-mono">consumePurchase</code>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-200/80 text-xs font-mono text-slate-500">
              Google Credential Manager Auth · Reconciles unconsumed tokens on startup.
            </div>
          </div>
        </div>

        {/* 6 Consumable Google Play Billing Diamond Packs Table */}
        <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 md:p-8 mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-mono text-slate-500">
                Google Play Billing Library · Consumable One-Time SKUs
              </p>
              <h3 className="text-xl font-bold text-[#22252A] mt-0.5">
                Six Consumable Diamond Pack Configurations
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>No Subscriptions · Localized via ProductDetails</span>
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-mono text-slate-500 bg-slate-50/70">
                  <th className="py-3.5 px-4">Product ID (SKU)</th>
                  <th className="py-3.5 px-4">Pack Name</th>
                  <th className="py-3.5 px-4">Diamond Quantity</th>
                  <th className="py-3.5 px-4">Reference Tier (USD)</th>
                  <th className="py-3.5 px-4">Cosmetic Unlocks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {DIAMOND_PACKS.map((pack) => (
                  <tr key={pack.sku} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-mono text-xs text-[#22252A]">
                      {pack.sku}
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#22252A]">
                      {pack.tierName}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold tabular-nums text-[#4A90E2]">
                      {pack.diamonds.toLocaleString()} Diamonds
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700">
                      {pack.referenceUsd}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600">
                      {pack.unlocksNote}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Player Support, FAQ & Play Store Compliance Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: FAQ Accordion */}
          <div className="lg:col-span-7">
            <p className="text-xs font-mono text-slate-500 mb-2">
              05. Player Support &amp; Technical FAQ
            </p>
            <h3 className="text-2xl font-bold text-[#22252A] mb-6">
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {SUPPORT_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={faq.question}
                    className="rounded-2xl border border-slate-200 bg-[#F4F6F8] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-bold text-[#22252A]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/70 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Columns: Google Play Store Compliance Hub Cards */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-mono text-slate-500 mb-2">
              Google Play Console Compliance Hub · Direct Endpoints
            </p>
            <h3 className="text-2xl font-bold text-[#22252A] mb-4">
              Official Legal &amp; Data Safety Hub
            </h3>

            <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  Endpoint: ?page=privacy
                </span>
                <FileText className="w-4 h-4 text-[#4A90E2]" />
              </div>
              <h4 className="text-lg font-bold text-[#22252A]">
                Official Privacy Policy
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete disclosure of Google Sign-In identity fields, Cloud Firestore diamond &amp; receipt storage,
                local-only Jetpack DataStore separation, and zero third-party ad tracking.
              </p>
              <button
                type="button"
                onClick={() => onNavigateCompliance('privacy')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#22252A] text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Open Full Privacy Policy (?page=privacy)
              </button>
            </div>

            <div className="bg-[#F4F6F8] rounded-2xl border border-slate-200 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500">
                  Endpoint: ?page=delete-account
                </span>
                <Trash2 className="w-4 h-4 text-[#D9381E]" />
              </div>
              <h4 className="text-lg font-bold text-[#22252A]">
                Account &amp; Data Deletion Guide
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fulfilling Google Play&apos;s Data Safety requirement: includes the 6-step instant in-app deletion walkthrough
                (Profile → Account Actions → Delete Account) and the data retention and anonymization schedule.
              </p>
              <button
                type="button"
                onClick={() => onNavigateCompliance('delete-account')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#D9381E] text-white text-xs font-semibold hover:bg-red-700 transition-colors cursor-pointer"
              >
                Open Account Deletion Guide (?page=delete-account)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
