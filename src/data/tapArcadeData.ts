export type ThemeCategory = 'Free' | 'Coin' | 'Premium';

export interface ThemePalette {
  id: string;
  name: string;
  category: ThemeCategory;
  priceLabel: string;
  priceAmount: number;
  currency: 'FREE' | 'COINS' | 'DIAMONDS';
  background: string;
  surface: string;
  primary: string;
  hazard: string;
  text: string;
  contrastNote: string;
}

export const ALL_THEMES: ThemePalette[] = [
  {
    id: 'pure',
    name: 'Pure',
    category: 'Free',
    priceLabel: 'Free (Default)',
    priceAmount: 0,
    currency: 'FREE',
    background: '#FFFFFF',
    surface: '#F4F6F8',
    primary: '#4A90E2',
    hazard: '#D9381E',
    text: '#22252A',
    contrastNote: 'Default Swiss light canvas with electric blue targets and vermilion octagon hazards.',
  },
  {
    id: 'mint',
    name: 'Mint',
    category: 'Coin',
    priceLabel: '300 Coins',
    priceAmount: 300,
    currency: 'COINS',
    background: '#F2FBF7',
    surface: '#E1F5EC',
    primary: '#10B981',
    hazard: '#E11D48',
    text: '#064E3B',
    contrastNote: 'Botanical glacier mint surface paired with emerald targets and rose-red hazards.',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    category: 'Coin',
    priceLabel: '500 Coins',
    priceAmount: 500,
    currency: 'COINS',
    background: '#FFF8F3',
    surface: '#FFEDE0',
    primary: '#F97316',
    hazard: '#7C2D12',
    text: '#431407',
    contrastNote: 'Warm solar alabaster paired with tangerine targets and deep mahogany hazards.',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'Coin',
    priceLabel: '800 Coins',
    priceAmount: 800,
    currency: 'COINS',
    background: '#F0F8FF',
    surface: '#E0F0FF',
    primary: '#0284C7',
    hazard: '#DC2626',
    text: '#0C4A6E',
    contrastNote: 'Crisp marine ice canvas with cerulean targets and crimson warning octagons.',
  },
  {
    id: 'neon_pulse',
    name: 'Neon Pulse',
    category: 'Premium',
    priceLabel: '50 Diamonds',
    priceAmount: 50,
    currency: 'DIAMONDS',
    background: '#F7F5FF',
    surface: '#EDE9FE',
    primary: '#7C3AED',
    hazard: '#EA580C',
    text: '#2E1065',
    contrastNote: 'Ultraviolet day-lit synth palette with vivid violet targets and blaze orange hazards.',
  },
  {
    id: 'crimson',
    name: 'Crimson',
    category: 'Premium',
    priceLabel: '70 Diamonds',
    priceAmount: 70,
    currency: 'DIAMONDS',
    background: '#FFF5F5',
    surface: '#FFE3E3',
    primary: '#E11D48',
    hazard: '#1E293B',
    text: '#4C0519',
    contrastNote: 'High-velocity carmine targets contrasted against obsidian slate octagons.',
  },
  {
    id: 'cyber_grid',
    name: 'Cyber Grid',
    category: 'Premium',
    priceLabel: '150 Diamonds',
    priceAmount: 150,
    currency: 'DIAMONDS',
    background: '#F0FDF4',
    surface: '#DCFCE7',
    primary: '#059669',
    hazard: '#D97706',
    text: '#064E3B',
    contrastNote: 'Clean terminal jade geometry with amber warning octagons.',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'Premium',
    priceLabel: '160 Diamonds',
    priceAmount: 160,
    currency: 'DIAMONDS',
    background: '#F0FDFA',
    surface: '#CCFBF1',
    primary: '#0D9488',
    hazard: '#BE123C',
    text: '#134E4A',
    contrastNote: 'Nordic teal daylight field balanced with garnet octagon hazards.',
  },
  {
    id: 'galaxy',
    name: 'Galaxy',
    category: 'Premium',
    priceLabel: '250 Diamonds',
    priceAmount: 250,
    currency: 'DIAMONDS',
    background: '#F5F3FF',
    surface: '#E0E7FF',
    primary: '#4F46E5',
    hazard: '#DB2777',
    text: '#1E1B4B',
    contrastNote: 'Deep indigo orbital targets with magenta warning octagons.',
  },
  {
    id: 'ember',
    name: 'Ember',
    category: 'Premium',
    priceLabel: '275 Diamonds',
    priceAmount: 275,
    currency: 'DIAMONDS',
    background: '#FFFBEB',
    surface: '#FEF3C7',
    primary: '#D97706',
    hazard: '#991B1B',
    text: '#451A03',
    contrastNote: 'Warm forge gold canvas with amber targets and brick-red hazards.',
  },
  {
    id: 'gold_rush',
    name: 'Gold Rush',
    category: 'Premium',
    priceLabel: '300 Diamonds',
    priceAmount: 300,
    currency: 'DIAMONDS',
    background: '#FEFCE8',
    surface: '#FEF08A',
    primary: '#CA8A04',
    hazard: '#7F1D1D',
    text: '#422006',
    contrastNote: 'Bullion gold accents paired with deep burgundy warning octagons.',
  },
  {
    id: 'holographic',
    name: 'Holographic',
    category: 'Premium',
    priceLabel: '400 Diamonds',
    priceAmount: 400,
    currency: 'DIAMONDS',
    background: '#FDF4FF',
    surface: '#FAE8FF',
    primary: '#C026D3',
    hazard: '#0F172A',
    text: '#4A044E',
    contrastNote: 'Prismatic fuchsia targets with high-contrast midnight slate hazards.',
  },
  {
    id: 'void',
    name: 'Void',
    category: 'Premium',
    priceLabel: '500 Diamonds',
    priceAmount: 500,
    currency: 'DIAMONDS',
    background: '#F8FAFC',
    surface: '#E2E8F0',
    primary: '#334155',
    hazard: '#EF4444',
    text: '#0F172A',
    contrastNote: 'Monochrome architectural slate targets with signal red octagons.',
  },
];

export interface DiamondPackItem {
  sku: string;
  tierName: string;
  diamonds: number;
  referenceUsd: string;
  unlocksNote: string;
}

export const DIAMOND_PACKS: DiamondPackItem[] = [
  {
    sku: 'taparcade_diamonds_70',
    tierName: 'Starter Pouch',
    diamonds: 70,
    referenceUsd: '$0.99',
    unlocksNote: 'Unlocks Neon Pulse (50) or Crimson (70)',
  },
  {
    sku: 'taparcade_diamonds_150',
    tierName: 'Reflex Pack',
    diamonds: 150,
    referenceUsd: '$1.99',
    unlocksNote: 'Unlocks Cyber Grid (150) or 2 starter themes',
  },
  {
    sku: 'taparcade_diamonds_400',
    tierName: 'Arcade Bundle',
    diamonds: 400,
    referenceUsd: '$4.99',
    unlocksNote: 'Unlocks Holographic (400), Gold Rush (300), or Galaxy (250)',
  },
  {
    sku: 'taparcade_diamonds_800',
    tierName: 'Theme Vault',
    diamonds: 800,
    referenceUsd: '$9.99',
    unlocksNote: 'Unlocks Void (500) + Gold Rush (300)',
  },
  {
    sku: 'taparcade_diamonds_1200',
    tierName: 'Master Chest',
    diamonds: 1200,
    referenceUsd: '$14.99',
    unlocksNote: 'Unlocks up to 6 Premium Themes',
  },
  {
    sku: 'taparcade_diamonds_2000',
    tierName: 'Complete Studio Pack',
    diamonds: 2000,
    referenceUsd: '$24.99',
    unlocksNote: 'Covers all 9 Premium Themes (2,155 total)',
  },
];

export interface GalleryMediaItem {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  fallbackSrc: string;
  resolution: string;
  aspect: 'portrait-phone' | 'portrait-tablet' | 'landscape-tablet' | 'banner';
  category: 'raw' | 'promo-phone' | 'tablet';
  description: string;
}

export const GALLERY_MEDIA: GalleryMediaItem[] = [
  {
    id: 'raw-home',
    title: 'Home & Play Readiness Screen',
    subtitle: 'Actual Android Build · Unedited Capture',
    src: '/images/raw-home.png',
    fallbackSrc: '/assets/aistudio/Screenshot_2026-10-24-22-26-55-898_com.ekteder.taparcade_5dc375a6.jpg',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'raw',
    description: 'Displays live local Coin balance (160), cloud-synced Diamond balance (0), equipped theme indicator (Sunset), Personal Best (660), central Play trigger, and 3-rule summary card.',
  },
  {
    id: 'raw-themes',
    title: 'Themes Studio — Coin Tier Tab',
    subtitle: 'Actual Android Build · Unedited Capture',
    src: '/images/raw-themes.png',
    fallbackSrc: '/assets/aistudio/Screenshot_2026-10-24-22-27-10-463_com.ekteder.taparcade_4880e3bd.jpg',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'raw',
    description: 'Shows the 5-swatch accessible color preview on each card (Mint 300 Coins, Sunset Owned & Equipped, Ocean 800 Coins) plus the local storage disclosure footer.',
  },
  {
    id: 'raw-shop-coins',
    title: 'Shop — Local Coins Balance & Rules',
    subtitle: 'Actual Android Build · Unedited Capture',
    src: '/images/raw-shop-coins.png',
    fallbackSrc: '/assets/aistudio/Screenshot_2026-10-24-22-27-14-676_com.ekteder.taparcade_661d465c.jpg',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'raw',
    description: 'Transparently explains that Coins are earned exclusively through skill (1 coin per point in completed runs) and stored locally in Jetpack DataStore.',
  },
  {
    id: 'raw-shop-diamonds',
    title: 'Shop — Consumable Diamond Packs',
    subtitle: 'Actual Android Build · Unedited Capture',
    src: '/images/raw-shop-diamonds.png',
    fallbackSrc: '/assets/aistudio/Screenshot_2026-10-24-22-27-17-901_com.ekteder.taparcade_d8bf8cbd.jpg',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'raw',
    description: 'Lists the Google Play Billing diamond packs verified via atomic Cloud Firestore transactions and server-authoritative receipt ledgers.',
  },
  {
    id: 'raw-profile',
    title: 'Profile — Local Career Stats & Account Actions',
    subtitle: 'Actual Android Build · Unedited Capture',
    src: '/images/raw-profile.png',
    fallbackSrc: '/assets/aistudio/Screenshot_2026-10-24-22-27-21-336_com.ekteder.taparcade_e31f39ad.jpg',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'raw',
    description: 'Displays UID-scoped Personal Best (660), Completed Games (1), Total Playtime (0h 1m 18s), Owned Themes (2 / 13), procedural Sound Effects toggle, and Account Actions.',
  },
  {
    id: 'promo-phone-1',
    title: 'Tap Fast — Hit Shrinking Targets',
    subtitle: 'Play Store Phone Poster 01',
    src: '/images/promo-phone-1.png',
    fallbackSrc: '/assets/aistudio/tap-arcade-screen-1-tap-fast-1080x1920_dd4c9722.png',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'promo-phone',
    description: 'Highlights +10 PTS PER TARGET and 1 Coin Earned Per Point Scored in completed runs.',
  },
  {
    id: 'promo-phone-2',
    title: 'Dodge Hazards — High-Stakes Streaks',
    subtitle: 'Play Store Phone Poster 02',
    src: '/images/promo-phone-2.png',
    fallbackSrc: '/assets/aistudio/tap-arcade-screen-2-dodge-hazards-1080x1920_b5589e9e.png',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'promo-phone',
    description: 'Emphasizes the 3-lives rule and avoiding warning shapes to complete runs and bank earned coins.',
  },
  {
    id: 'promo-phone-3',
    title: 'Unlock Themes — 13 Custom Palettes',
    subtitle: 'Play Store Phone Poster 03',
    src: '/images/promo-phone-3.png',
    fallbackSrc: '/assets/aistudio/tap-arcade-screen-3-unlock-themes-1080x1920_9cc7bc50.png',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'promo-phone',
    description: 'Showcases Mint, Sunset, and Ocean coin themes alongside the 9 diamond-tier palettes.',
  },
  {
    id: 'promo-phone-4',
    title: 'Beat Your High Score — Career Mastery',
    subtitle: 'Play Store Phone Poster 04',
    src: '/images/promo-phone-4.png',
    fallbackSrc: '/assets/aistudio/tap-arcade-screen-4-beat-high-score-1080x1920_9fd22294.png',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'promo-phone',
    description: 'Highlights personal career statistics, total active playtime tracking, and procedural audio controls.',
  },
  {
    id: 'promo-phone-5',
    title: 'Expand Your Vault — Cosmetic Shop',
    subtitle: 'Play Store Phone Poster 05',
    src: '/images/promo-phone-5.png',
    fallbackSrc: '/assets/aistudio/tap-arcade-screen-5-arcade-shop-1080x1920_0a6d7071.png',
    resolution: '1080 × 1920 · 9:16',
    aspect: 'portrait-phone',
    category: 'promo-phone',
    description: 'Demonstrates the Coins & Diamonds Vault with instant cosmetic theme access and zero pay-to-win.',
  },
  {
    id: 'promo-tablet-1',
    title: '7-Inch Tablet Edition — Tap Fast',
    subtitle: 'Play Store Tablet Showcase (1200 × 1920)',
    src: '/images/promo-tablet-1.png',
    fallbackSrc: '/assets/aistudio/tablet-7inch-01_5344cee1.png',
    resolution: '1200 × 1920 · 10:16',
    aspect: 'portrait-tablet',
    category: 'tablet',
    description: 'Proportional tablet layout preserving generous touch targets and clean whitespace on 7-inch displays.',
  },
  {
    id: 'promo-tablet-2',
    title: '7-Inch Tablet Edition — Dodge Hazards',
    subtitle: 'Play Store Tablet Showcase (1200 × 1920)',
    src: '/images/promo-tablet-2.png',
    fallbackSrc: '/assets/aistudio/tablet-7inch-02_5a026c4e.png',
    resolution: '1200 × 1920 · 10:16',
    aspect: 'portrait-tablet',
    category: 'tablet',
    description: 'Clear coin economy breakdown and local storage transparency on medium-format Android tablets.',
  },
  {
    id: 'promo-tablet-3',
    title: '7-Inch Tablet Edition — Unlock Themes',
    subtitle: 'Play Store Tablet Showcase (1200 × 1920)',
    src: '/images/promo-tablet-3.png',
    fallbackSrc: '/assets/aistudio/tablet-7inch-03_ed8be0a5.png',
    resolution: '1200 × 1920 · 10:16',
    aspect: 'portrait-tablet',
    category: 'tablet',
    description: 'Accessible 5-swatch palette cards scaled for tablet viewing.',
  },
  {
    id: 'promo-tablet-4',
    title: '7-Inch Tablet Edition — Beat Your High Score',
    subtitle: 'Play Store Tablet Showcase (1200 × 1920)',
    src: '/images/promo-tablet-4.png',
    fallbackSrc: '/assets/aistudio/tablet-7inch-04_795eff3b.png',
    resolution: '1200 × 1920 · 10:16',
    aspect: 'portrait-tablet',
    category: 'tablet',
    description: 'Career statistics and audio preferences on 7-inch Android tablets.',
  },
  {
    id: 'promo-tablet-5',
    title: '7-Inch Tablet Edition — Expand Your Vault',
    subtitle: 'Play Store Tablet Showcase (1200 × 1920)',
    src: '/images/promo-tablet-5.png',
    fallbackSrc: '/assets/aistudio/tablet-7inch-05_86c0853c.png',
    resolution: '1200 × 1920 · 10:16',
    aspect: 'portrait-tablet',
    category: 'tablet',
    description: 'Diamond vault packs presented in a responsive tablet container.',
  },
  {
    id: 'promo-tablet-10-3',
    title: '10-Inch Tablet Showcase — Unlock 13 Curated Palettes',
    subtitle: 'Wide-Format 10-Inch Tablet Presentation',
    src: '/images/promo-tablet-10-3.png',
    fallbackSrc: '/assets/aistudio/tablet-10inch-03_a5dbb346.png',
    resolution: '1920 × 1080 · 16:9',
    aspect: 'landscape-tablet',
    category: 'tablet',
    description: 'Wide-aspect 10-inch tablet presentation showcasing instant visual restyling across targets, backgrounds, and UI accents.',
  },
  {
    id: 'promo-tablet-10-4',
    title: '10-Inch Tablet Showcase — Detailed Career Statistics',
    subtitle: 'Wide-Format 10-Inch Tablet Presentation',
    src: '/images/promo-tablet-10-4.png',
    fallbackSrc: '/assets/aistudio/tablet-10inch-04_c528dbea.png',
    resolution: '1920 × 1080 · 16:9',
    aspect: 'landscape-tablet',
    category: 'tablet',
    description: 'Highlights career stats, tactile procedural sound effects, and instant device persistence on 10-inch tablets.',
  },
  {
    id: 'feature-graphic-main',
    title: 'Official Google Play Feature Graphic (Primary)',
    subtitle: 'Google Play Store Header Banner',
    src: '/images/feature-graphic.png',
    fallbackSrc: '/assets/aistudio/feature-graphic-1024x500_256962b7.png',
    resolution: '1024 × 500',
    aspect: 'banner',
    category: 'tablet',
    description: 'Official 1024×500 Google Play Store feature graphic showcasing multi-device screenshots and the 5 core colorways.',
  },
  {
    id: 'feature-graphic-alt',
    title: 'Official Google Play Feature Graphic (Targets & Hazards Edition)',
    subtitle: 'Google Play Store Header Banner Variant',
    src: '/images/feature-graphic-alt.png',
    fallbackSrc: '/assets/aistudio/feature-graphic-option1-1024x500_69d87a3e.png',
    resolution: '1024 × 500',
    aspect: 'banner',
    category: 'tablet',
    description: 'Alternate 1024×500 feature graphic highlighting circular +10 targets, shrinking lifetime rings, and warning hazards.',
  },
];

export interface SoundCueSpec {
  id: 'target_tap' | 'score_milestone' | 'hazard_buzz' | 'life_loss' | 'countdown_tick' | 'game_over';
  name: string;
  trigger: string;
  waveform: string;
  frequencySpec: string;
  durationMs: number;
}

export const SOUND_CUE_SPECS: SoundCueSpec[] = [
  {
    id: 'target_tap',
    name: 'Target Tap Blip',
    trigger: 'Valid circular target tap (+10 pts)',
    waveform: 'Sine Oscillator with exponential decay',
    frequencySpec: '880 Hz (A5)',
    durationMs: 75,
  },
  {
    id: 'score_milestone',
    name: 'Positive Score Chirp',
    trigger: 'Every 50 points scored in a run',
    waveform: 'Dual Sine Harmonic Step',
    frequencySpec: '660 Hz (E5) → 880 Hz (A5)',
    durationMs: 140,
  },
  {
    id: 'hazard_buzz',
    name: 'Hazard Warning Buzz',
    trigger: 'Tapping an octagonal ! hazard',
    waveform: 'Sawtooth / Square Low-Frequency Buzz',
    frequencySpec: '180 Hz → 135 Hz',
    durationMs: 210,
  },
  {
    id: 'life_loss',
    name: 'Missed Target / Life Loss Sweep',
    trigger: 'Target lifetime ring reaches 0.0s (-1 life)',
    waveform: 'Triangle Descending Frequency Sweep',
    frequencySpec: '330 Hz (E4) → 110 Hz (A2)',
    durationMs: 240,
  },
  {
    id: 'countdown_tick',
    name: 'Pre-Game Countdown & Go! Arpeggio',
    trigger: '3 → 2 → 1 → Go! sequence on every start/restart',
    waveform: 'Sine Pulse + 3-Note Major Triad',
    frequencySpec: '440 Hz ticks · C5 → E5 → G5 on Go!',
    durationMs: 320,
  },
  {
    id: 'game_over',
    name: 'Game Over Resolution Arpeggio',
    trigger: 'All 3 lives lost (natural run completion)',
    waveform: 'Warm Triangle Minor Descent',
    frequencySpec: 'G4 (392 Hz) → Eb4 (311 Hz) → C4 (261.6 Hz)',
    durationMs: 520,
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const SUPPORT_FAQS: FaqItem[] = [
  {
    question: 'Why does Tap Arcade require an active internet connection and Google Sign-In?',
    answer:
      'Tap Arcade is architected as an authenticated, online-validated application so that your account identity, diamond balance, and premium theme entitlements remain synchronized and protected by Cloud Firestore security rules without relying on spoofable guest sessions.',
  },
  {
    question: 'What happens if my phone loses internet connection or goes to the background mid-run?',
    answer:
      'To preserve fair play and prevent pause-buffer exploits, any run interrupted by app minimization (ON_STOP / ON_PAUSE), screen lock, or network loss is terminated immediately. Interrupted runs award 0 coins and do not increment completed games or total playtime.',
  },
  {
    question: 'What is the difference between Coins and Diamonds?',
    answer:
      'Coins are earned strictly through gameplay skill (1 coin per point in completed runs) and are stored locally on your device in Jetpack DataStore to unlock the Mint (300), Sunset (500), and Ocean (800) themes. Diamonds are optional server-verified currency stored in Cloud Firestore to unlock the 9 Premium cosmetic themes.',
  },
  {
    question: 'Do Premium Themes or Diamonds give any gameplay advantage?',
    answer:
      'Never. All 13 themes are 100% cosmetic colorways. Target sizes (64.dp), spawn intervals, lifetime curves, and scoring (+10 pts per target) are identical across every theme.',
  },
  {
    question: 'Why are Coins and Career Statistics lost if I uninstall the app?',
    answer:
      'By design, Tap Arcade minimizes cloud data collection. Only your Diamond balance and Premium Themes are stored in Cloud Firestore. Your Coins, Coin Themes, Personal Best, Completed Games, and Total Playtime are stored exclusively on your device inside UID-namespaced Jetpack DataStore.',
  },
  {
    question: 'How do I permanently delete my Tap Arcade account and data?',
    answer:
      'You can delete your account instantaneously inside the Android app via Profile → Account Actions → Delete Account. You can also review the full step-by-step deletion guide and data retention specifications on our Delete Account page.',
  },
];
