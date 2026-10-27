/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Play, ArrowRight, Check, Copy } from 'lucide-react';
import { ALL_THEMES, ThemePalette } from './data/tapArcadeData';
import { PlayablePhoneDemo } from './components/PlayablePhoneDemo';
import { MediaGallerySection } from './components/MediaGallerySection';
import { GameplayMechanicsSection } from './components/GameplayMechanicsSection';
import { ThemeStudioSection } from './components/ThemeStudioSection';
import { FairPlayEconomySection } from './components/FairPlayEconomySection';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { AccountDeletionView } from './components/AccountDeletionView';
import { ResilientImage } from './components/ResilientImage';
import { SITE_CONFIG } from './config/siteConfig';

type ActiveView = 'landing' | 'privacy' | 'delete-account';

function resolveViewFromLocation(): ActiveView {
  if (typeof window === 'undefined') return 'landing';
  const params = new URLSearchParams(window.location.search);
  const pageParam = (params.get('page') || '').toLowerCase();
  const hash = (window.location.hash || '').toLowerCase();

  if (
    pageParam === 'privacy' ||
    pageParam === 'privacy-policy' ||
    hash === '#privacy' ||
    hash === '#privacy-policy'
  ) {
    return 'privacy';
  }
  if (
    pageParam === 'delete-account' ||
    pageParam === 'account-deletion' ||
    pageParam === 'delete' ||
    hash === '#delete-account' ||
    hash === '#account-deletion'
  ) {
    return 'delete-account';
  }
  return 'landing';
}

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>(() => resolveViewFromLocation());
  const [activeTheme, setActiveTheme] = useState<ThemePalette>(ALL_THEMES[0]); // Pure default
  const [externalPlayTrigger, setExternalPlayTrigger] = useState<number>(0);
  const [copiedPkg, setCopiedPkg] = useState<boolean>(false);

  // Synchronize URL query parameters & hash changes for Google Play Console compliance links
  useEffect(() => {
    const syncFromUrl = () => {
      setActiveView(resolveViewFromLocation());
    };
    window.addEventListener('popstate', syncFromUrl);
    window.addEventListener('hashchange', syncFromUrl);
    return () => {
      window.removeEventListener('popstate', syncFromUrl);
      window.removeEventListener('hashchange', syncFromUrl);
    };
  }, []);

  const navigateToView = useCallback((view: ActiveView, sectionId?: string) => {
    setActiveView(view);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'privacy') {
        url.searchParams.set('page', 'privacy');
        url.hash = '';
        window.history.pushState({}, '', url.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (view === 'delete-account') {
        url.searchParams.set('page', 'delete-account');
        url.hash = '';
        window.history.pushState({}, '', url.toString());
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        url.searchParams.delete('page');
        url.hash = sectionId ? `#${sectionId}` : '';
        window.history.pushState({}, '', url.toString());
        if (sectionId) {
          window.setTimeout(() => {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 40);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  }, []);

  const handleStartLiveBrowserDemo = () => {
    if (activeView !== 'landing') {
      navigateToView('landing');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setExternalPlayTrigger((prev) => prev + 1);
  };

  const handleCopyPackageId = () => {
    navigator.clipboard.writeText(SITE_CONFIG.packageId).catch(() => {});
    setCopiedPkg(true);
    window.setTimeout(() => setCopiedPkg(false), 1800);
  };

  const googlePlayStoreUrl = SITE_CONFIG.playStoreUrl;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#22252A]">
      {/* Sticky Top Navigation Header (Strict 3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single Text Element Wordmark */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateToView('landing');
            }}
            className="text-lg font-extrabold tracking-tight text-[#22252A] whitespace-nowrap shrink-0"
          >
            {SITE_CONFIG.appName}
          </a>

          {/* Zone 2: 5 Concise Single-Line Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
            aria-label="Primary Navigation"
          >
            <a
              href="#gameplay"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('landing', 'gameplay');
              }}
              className="hover:text-[#22252A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Gameplay
            </a>
            <a
              href="#screenshots"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('landing', 'screenshots');
              }}
              className="hover:text-[#22252A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Screenshots
            </a>
            <a
              href="#themes"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('landing', 'themes');
              }}
              className="hover:text-[#22252A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              13 Themes
            </a>
            <a
              href="?page=privacy"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('privacy');
              }}
              className={`hover:text-[#22252A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'privacy' ? 'text-[#22252A] font-semibold underline' : ''
              }`}
            >
              Privacy Policy
            </a>
            <a
              href="?page=delete-account"
              onClick={(e) => {
                e.preventDefault();
                navigateToView('delete-account');
              }}
              className={`hover:text-[#22252A] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 ${
                activeView === 'delete-account' ? 'text-[#D9381E] font-semibold underline' : ''
              }`}
            >
              Delete Account
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={googlePlayStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-white bg-[#22252A] rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Get on Google Play</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content View Router */}
      <main className="flex-1">
        {activeView === 'privacy' ? (
          <PrivacyPolicyView
            onBackToHome={() => navigateToView('landing')}
            onNavigateDeleteAccount={() => navigateToView('delete-account')}
          />
        ) : activeView === 'delete-account' ? (
          <AccountDeletionView
            onBackToHome={() => navigateToView('landing')}
            onNavigatePrivacy={() => navigateToView('privacy')}
          />
        ) : (
          <>
            {/* HERO SECTION WITH LIVE PLAYABLE PHONE MOCKUP */}
            <section className="py-12 md:py-20 swiss-grid-bg border-b border-slate-200">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Left Column (7 Cols): App Identity, Copy & CTAs */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Official App Identity Row */}
                    <div className="flex items-center gap-3.5">
                      <ResilientImage
                        src="/images/app-logo.png"
                        fallbackSrc="/assets/aistudio/app-logo_ffdec672.png"
                        alt="Tap Arcade Official Star Logo"
                        className="w-12 h-12 rounded-2xl shadow-xs border border-slate-200 shrink-0"
                      />
                      <div className="text-xs font-mono text-slate-600 space-y-0.5">
                        <div className="flex flex-wrap items-center gap-1.5 font-semibold text-[#22252A]">
                          <span>{SITE_CONFIG.developerName}</span>
                          <span aria-hidden="true">·</span>
                          <span>Arcade / Action</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#10B981]">100% Ad-Free</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-slate-500">
                          <span>{SITE_CONFIG.appVersion} Release</span>
                          <span aria-hidden="true">·</span>
                          <span>{SITE_CONFIG.minAndroidVersion}</span>
                          <span aria-hidden="true">·</span>
                          <button
                            type="button"
                            onClick={handleCopyPackageId}
                            className="inline-flex items-center gap-1 hover:text-[#22252A] cursor-pointer"
                            title="Copy Package ID"
                          >
                            <span>{SITE_CONFIG.packageId}</span>
                            {copiedPkg ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Display Headline */}
                    <h1
                      className="font-extrabold tracking-tight text-[#22252A] leading-[1.08] text-balance"
                      style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
                    >
                      A Modern Reflex Arcade Experience. Fast, Tactile, and Completely Ad-Free.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl">
                      Tap circular targets before their lifetime rings shrink to zero. Evade octagonal warning hazards.
                      Unlock 13 high-contrast themes. Pure skill and rhythm—engineered by{' '}
                      <strong className="text-[#22252A]">{SITE_CONFIG.developerName}</strong> for Android phones and tablets.
                    </p>

                    {/* Primary & Secondary Action CTAs */}
                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                      <a
                        href={googlePlayStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-xl bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold text-sm transition-colors flex items-center gap-2.5 shadow-xs whitespace-nowrap shrink-0"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Download on Google Play</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleStartLiveBrowserDemo}
                        className="px-5 py-3.5 rounded-xl bg-[#22252A] hover:bg-slate-800 text-white font-semibold text-sm transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Play Live Browser Demo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => navigateToView('landing', 'screenshots')}
                        className="px-5 py-3.5 rounded-xl bg-[#F4F6F8] hover:bg-slate-200/80 text-[#22252A] border border-slate-200 font-semibold text-sm transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        View App Screenshots
                      </button>
                    </div>

                    {/* Key Specs Strip (Clean Unboxed Typography with · Separators) */}
                    <div className="pt-4 border-t border-slate-200/90 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-mono text-slate-600">
                      <span className="font-semibold text-[#22252A]">60 FPS Canvas</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#22252A]">6 Procedural Audio Cues</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#22252A]">13 Accessible Themes</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-[#22252A]">Phone &amp; Tablet Ready</span>
                    </div>
                  </div>

                  {/* Right Column (5 Cols): Interactive 360×640px Playable Phone Mockup */}
                  <div className="lg:col-span-5 flex justify-center">
                    <PlayablePhoneDemo
                      activeTheme={activeTheme}
                      onSelectTheme={setActiveTheme}
                      externalPlayTrigger={externalPlayTrigger}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 1: MULTI-FORMAT SCREENSHOT & DEVICE GALLERY */}
            <MediaGallerySection />

            {/* SECTION 2: CORE GAMEPLAY, SPATIAL RULES & DIFFICULTY CALCULATOR */}
            <GameplayMechanicsSection activeTheme={activeTheme} />

            {/* SECTION 3: INTERACTIVE 13-THEME STUDIO & LIVE PALETTE SWITCHER */}
            <ThemeStudioSection
              activeTheme={activeTheme}
              onSelectTheme={setActiveTheme}
              onJumpToHeroDemo={handleStartLiveBrowserDemo}
            />

            {/* SECTION 4: FAIR PLAY, ETHICAL ECONOMY & STORAGE SEPARATION + FAQ */}
            <FairPlayEconomySection
              onNavigateCompliance={(page) => navigateToView(page)}
            />

            {/* BOTTOM CTA BANNER FEATURING OFFICIAL FEATURE GRAPHIC (1024×500) */}
            <section className="py-16 bg-[#F4F6F8] border-t border-slate-200">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-4">
                    <p className="text-xs font-mono text-slate-500">
                      Available on Google Play · Phone &amp; Tablet Supported
                    </p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#22252A] tracking-tight text-balance">
                      Test Your Reflexes. Beat Your Best. Zero Ads. Pure Arcade.
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Download <strong className="text-[#22252A]">{SITE_CONFIG.appName}</strong> (<code className="font-mono text-xs">{SITE_CONFIG.packageId}</code>) on {SITE_CONFIG.minAndroidVersion} devices. Experience 60 FPS Jetpack Compose Canvas responsiveness, 13 high-contrast cosmetic palettes, and complete data transparency.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={googlePlayStoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-xl bg-[#22252A] hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>Get Tap Arcade on Google Play</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleStartLiveBrowserDemo}
                        className="px-5 py-3.5 rounded-xl bg-[#F4F6F8] hover:bg-slate-200/80 text-[#22252A] border border-slate-200 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Launch Interactive Web Demo ↑
                      </button>
                    </div>
                  </div>

                  {/* Official 1024×500 Feature Graphic Frame */}
                  <div className="lg:col-span-6">
                    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-[#14171C]">
                      <ResilientImage
                        src="/images/feature-graphic.png"
                        fallbackSrc="/assets/aistudio/feature-graphic-1024x500_256962b7.png"
                        alt="Tap Arcade Official Google Play Feature Graphic (1024x500)"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-3.5">
            <ResilientImage
              src="/images/app-logo.png"
              fallbackSrc="/assets/aistudio/app-logo_ffdec672.png"
              alt="Tap Arcade App Icon"
              className="w-10 h-10 rounded-xl border border-slate-200 shrink-0"
            />
            <div>
              <p className="text-sm font-bold text-[#22252A]">
                {SITE_CONFIG.appName} · Developed by {SITE_CONFIG.developerName}
              </p>
              <p className="text-xs font-mono text-slate-500">
                Package ID: {SITE_CONFIG.packageId} · {SITE_CONFIG.minAndroidVersion}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => navigateToView('landing', 'gameplay')}
              className="hover:text-[#22252A] cursor-pointer"
            >
              Gameplay
            </button>
            <button
              type="button"
              onClick={() => navigateToView('landing', 'screenshots')}
              className="hover:text-[#22252A] cursor-pointer"
            >
              Screenshots
            </button>
            <button
              type="button"
              onClick={() => navigateToView('landing', 'themes')}
              className="hover:text-[#22252A] cursor-pointer"
            >
              13 Themes
            </button>
            <button
              type="button"
              onClick={() => navigateToView('landing', 'fair-play')}
              className="hover:text-[#22252A] cursor-pointer"
            >
              Fair Play &amp; Economy
            </button>
            <button
              type="button"
              onClick={() => navigateToView('privacy')}
              className="hover:text-[#22252A] font-semibold text-[#4A90E2] cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => navigateToView('delete-account')}
              className="hover:text-[#22252A] font-semibold text-[#D9381E] cursor-pointer"
            >
              Delete Account
            </button>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.developerName}. All rights reserved. Google Play and the Google Play logo are trademarks of Google LLC.</p>
          <a
            href={`mailto:${SITE_CONFIG.supportEmail}`}
            className="font-mono hover:text-[#22252A] underline"
          >
            Support: {SITE_CONFIG.supportEmail}
          </a>
        </div>
      </footer>
    </div>
  );
}
