# MASTER PROMPT — TAP ARCADE
Build a Complete, Production-Ready Android Game & Serverless Backend

Act as a senior Android engineer, mobile game developer, backend engineer, UI/UX designer, and QA engineer. Build a complete Android Studio project and Firebase serverless backend for **Tap Arcade**, a lightweight, polished reflex-tapping arcade game.

Do not deliver a prototype, mockup, tutorial, or partial code snippets with `// TODO` placeholders. Deliver a complete, buildable project with working gameplay, navigation, authentication, backend integration, purchases, tests, configuration instructions, and release documentation.

---

## 1. Product Overview & Locked Technology Stack
- **App name:** Tap Arcade
- **Package ID Placeholder:** `com.yourstudio.taparcade` (clearly marked for replacement before release)
- **Platform:** Android (Minimum SDK: API 26 / Android 8.0, Target/Compile SDK: API 35)
- **Language:** English only
- **Orientation:** Portrait only (`android:screenOrientation="portrait"`)
- **Design direction:** Minimal, modern, responsive, clean, and lightweight. Light mode only (no dark-mode toggle).
- **Monetization:** Optional cosmetic purchases only. No advertisements, subscriptions, cash-outs, real-money rewards, leaderboards, daily missions, or gameplay advantages sold for money.

### Locked Technical Stack
- **Android UI & Architecture:** Kotlin, Jetpack Compose (Material 3), MVVM/MVI Clean Architecture, Hilt for Dependency Injection, Kotlin Coroutines & `StateFlow`, Navigation Compose.
- **2D Gameplay Surface:** Custom-drawn Jetpack Compose `Canvas` driven by a frame-accurate `withFrameNanos` game loop.
- **Procedural Audio Engine:** Custom programmatic `AudioTrack` PCM tone synthesizer generating clean, subtle, low-latency waveforms for all 6 game sound effects (zero external binary `.wav`/`.ogg` dependencies required to build).
- **Authentication:** Firebase Authentication using the modern Android Credential Manager API (`androidx.credentials` + `googleid`) with `GoogleAuthProvider`.
- **Trusted Backend (Diamonds, Premium Themes, Purchase Receipt Ledger):** Cloud Firestore with atomic `runTransaction` operations and user-isolated security rules (100% Free / Spark Plan compatible; optional Cloud Functions 2nd Gen backend supported).
- **Billing:** Google Play Billing Library (`billing-ktx`) using client-side `consumePurchase` / server-side consumption for repeatable diamond packs, and passing `setObfuscatedAccountId(uid)` on every purchase flow.
- **Local Persistence (Coins, Stats, Preferences):** Jetpack DataStore (Preferences), strictly namespaced by the authenticated user's Firebase `uid` so local data never leaks across accounts on the same device.

### Non-Negotiable Access Policy & Currency Separation
Tap Arcade is an **online-only, sign-in-required** application. Every app feature requires:
1. An active, validated internet connection.
2. A valid authenticated Google account.

There is no offline mode, guest mode, or offline gameplay. If connectivity is unavailable, block app access behind a dedicated connection-required screen. Do not expose cached game content or cached premium entitlements as a way to use the app offline. A signed-out user must immediately return to the Welcome/Sign-In flow.

**Strict Storage Separation:**
- **Internet & Authentication:** Required globally to access the app.
- **Coins, Coin-Theme Ownership & Gameplay Statistics:** Stored **strictly locally** on the device in Jetpack DataStore. Do NOT store or sync coins, scores, or gameplay stats to Cloud Firestore or any backend server.
- **Diamonds & Premium-Theme Ownership:** Stored **in Cloud Firestore** as persistent, account-synced records with atomic transactions and owner-isolated security rules.

---

## 2. Core Gameplay & Spatial Rules
Create an endless reflex-tapping game where the player taps circular targets to score points while avoiding hazards until all 3 lives are lost.

### Game Sequence
1. Player presses **Play** on the Home screen.
2. Confirm the user is authenticated and validated internet connectivity is active.
3. Start the countdown overlay: `3`, `2`, `1`, `Go!` (1 second per step). Every new run, including Restart, must repeat the complete countdown.
4. Begin active gameplay.
5. Continue until all 3 lives are lost.
6. Transition immediately to the Game Over screen showing final score and earned coins.

### Starting Rules & Rewards
- **Starting lives:** 3.
- **Points per valid target tap:** 10.
- **Coins earned:** Exactly 1 coin per point (e.g., 120 points = 120 local coins).
- **No survival-time bonus** and **no fixed coin reward cap**.
- **Completed runs only:** Award coins only when a run ends normally by losing all 3 lives. Never award coins for abandoned, paused-to-home, backgrounded, or connection-interrupted runs.

### Targets
- **Shape & Size:** Circular, `64.dp` diameter (`32.dp` radius) for comfortable touch accessibility.
- **Placement:** Randomized intelligently within playfield bounds. Enforce a minimum `96.dp` top HUD safe zone, `48.dp` bottom/side safe padding, and a minimum `88.dp` center-to-center distance between any two active entities (targets or hazards) to prevent unfair clustering or overlap.
- **Initial target lifetime:** 2.0 seconds (render a subtle shrinking outer ring or progress indicator showing remaining lifetime).
- **Initial target spawn interval:** 1.2 seconds.
- **Maximum simultaneous targets:** 4 (excluding hazards).
- **Expiry:** A target that expires without being tapped costs **1 life**.
- **Deduplication:** Each target carries a unique `id` and `isProcessed` flag. It can be processed only once—rapid multi-taps must never award points twice or deduct multiple lives.

### Hazards
- **Behavior:** Tapping a hazard costs **1 life**. Letting a hazard expire naturally (after 2.5 seconds on screen) is safe and costs 0 lives.
- **Visual Accessibility (Never rely on color alone):**
  - **Shape:** Distinct Octagon or Sharp Triangle (`64.dp` bounding box)—never a circle.
  - **Symbol:** Clearly visible centered exclamation warning symbol (`!`) or cross (`X`) drawn inside.
  - **Outline:** Strong contrasting `3.dp` stroke outline.
- **Maximum simultaneous hazards:** 4.
- **Initial hazard spawn interval:** 12.0 seconds.

### Difficulty Progression
Increase difficulty smoothly every **30 seconds** of active gameplay elapsed time (`step = floor(elapsedSeconds / 30)`):
- **Target Lifetime:** `max(0.8f, 2.0f - (step * 0.15f))` seconds (Safety floor: `0.8s`).
- **Target Spawn Interval:** `max(0.6f, 1.2f - (step * 0.08f))` seconds (Safety floor: `0.6s`).
- **Hazard Spawn Interval:** `max(5.0f, 12.0f - (step * 1.0f))` seconds (Safety floor: `5.0s`).

### Life-Loss Rules
- Missing one target = -1 life. Tapping one hazard = -1 life.
- One event can remove at most 1 life.
- When lives reach 0, immediately halt the game loop, stop gameplay audio, credit earned coins once, and show Game Over.

---

## 3. HUD, Pause, Restart, and Interruption Handling
### Gameplay HUD
- **Top-Left:** Three heart icons representing remaining lives (filled vs. outlined).
- **Top-Center:** Current score in bold, tabular numerals.
- **Top-Right:** Accessible Pause icon button (`48.dp` minimum touch target).

### Pause Menu
- When paused: Immediately freeze all target/hazard timers, spawning, and scoring, and stop all sound effects.
- Display a centered modal overlay over the dimmed, frozen canvas with three actions: **Resume**, **Restart** (starts a fresh run with `3, 2, 1, Go!`), and **Home** (requires a confirmation dialog warning that the current run will be abandoned without rewards).
- Pressing the Android system **Back** button during gameplay or countdown must trigger the Pause menu instead of exiting.

### Interrupted Runs
- If the app moves to the background (`ON_STOP` / `ON_PAUSE`), screen turns off, or internet connectivity drops during countdown or active gameplay, **terminate the run immediately**.
- Do not allow resuming an interrupted run. Display a non-dismissible state:
  > *"Run ended because the game was interrupted. No coins were awarded."*
  with buttons for **Play Again** and **Home**.
- Interrupted runs award **0 coins**, do **not** increment total completed games played, and do **not** add to total completed playtime.

---

## 4. Game Over and Local Statistics
### Game Over Overlay
Display a clean result card containing:
- Final Score.
- Coins Earned (`+X` with a smooth 600ms count-up animation).
- Updated Local Coin Balance (formatted with commas, e.g., `1,200`).
- **"New Personal Best!"** badge when `finalScore > previousBest`.
- Buttons: **Restart**, **Home**, and **View Statistics** (navigates to Profile).
- Guard coin crediting with a unique `runId` flag so orientation/recomposition or multiple callbacks can never credit coins twice for the same run.

### Profile Statistics (Local-Only)
Persist locally in Jetpack DataStore (scoped per Firebase `uid`):
- `personalBestScore: Int`
- `totalCompletedGames: Int`
- `totalCompletedPlaytimeSeconds: Long` (summed only from runs that reached natural Game Over).

---

## 5. Economy, Diamond Packs, and Themes
Never mix Coins and Diamonds in storage, UI state, or purchase logic. Always format currency balances as exact integers with thousands separators (`1,200`, never `1.2K`).

### Coins (Local Currency)
- Earned at 1 coin per point in completed runs.
- Used only to buy the 3 Coin Themes (`Mint`, `Sunset`, `Ocean`).
- Validated and deducted locally with mutex/atomic lock protection against double-taps.
- Clearly disclose in the UI (Shop Coins tab & Profile) that Coins, Coin Themes, and Statistics are stored locally on the device and will be lost if the app is uninstalled or app data is cleared.

### Diamonds (Server-Authoritative Premium Currency)
- Purchased exclusively via Google Play Billing and verified by the backend.
- Used only to unlock the 9 Premium Themes.
- Never grant diamonds based on client-side billing callbacks alone.

### Six Diamond Pack Configurations
Use Google Play Billing `ProductDetails` localized prices (`formattedPrice`) in the UI—never display hard-coded dollar strings as live storefront prices. Document and map these exact 6 product ID placeholders:

| Product ID Placeholder | Reference Tier (USD) | Diamond Quantity |
| :--- | :--- | :--- |
| `taparcade_diamonds_70` | \$0.99 | 70 |
| `taparcade_diamonds_150` | \$1.99 | 150 |
| `taparcade_diamonds_400` | \$4.99 | 400 |
| `taparcade_diamonds_800` | \$9.99 | 800 |
| `taparcade_diamonds_1200` | \$14.99 | 1,200 |
| `taparcade_diamonds_2000` | \$24.99 | 2,000 |

### 13 Launch Themes & Exact Accessible Color Palettes
All themes are strictly cosmetic. Separate themes into **Free**, **Coin**, and **Premium** sections on the Themes screen with static color-swatch previews. Use these exact hex palettes so every theme guarantees high contrast and readability:

| ID | Name | Category | Price | Background | Surface/Card | Primary/Target | Hazard Fill | Text/HUD |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `pure` | **Pure** | Free | Free | `#FFFFFF` | `#F4F6F8` | `#4A90E2` | `#D9381E` | `#22252A` |
| `mint` | **Mint** | Coin | 300 Coins | `#F2FBF7` | `#E1F5EC` | `#10B981` | `#E11D48` | `#064E3B` |
| `sunset` | **Sunset** | Coin | 500 Coins | `#FFF8F3` | `#FFEDE0` | `#F97316` | `#7C2D12` | `#431407` |
| `ocean` | **Ocean** | Coin | 800 Coins | `#F0F8FF` | `#E0F0FF` | `#0284C7` | `#DC2626` | `#0C4A6E` |
| `neon_pulse` | **Neon Pulse** | Premium | 50 Diamonds | `#F7F5FF` | `#EDE9FE` | `#7C3AED` | `#EA580C` | `#2E1065` |
| `crimson` | **Crimson** | Premium | 70 Diamonds | `#FFF5F5` | `#FFE3E3` | `#E11D48` | `#1E293B` | `#4C0519` |
| `cyber_grid` | **Cyber Grid** | Premium | 150 Diamonds | `#F0FDF4` | `#DCFCE7` | `#059669` | `#D97706` | `#064E3B` |
| `aurora` | **Aurora** | Premium | 160 Diamonds | `#F0FDFA` | `#CCFBF1` | `#0D9488` | `#BE123C` | `#134E4A` |
| `galaxy` | **Galaxy** | Premium | 250 Diamonds | `#F5F3FF` | `#E0E7FF` | `#4F46E5` | `#DB2777` | `#1E1B4B` |
| `ember` | **Ember** | Premium | 275 Diamonds | `#FFFBEB` | `#FEF3C7` | `#D97706` | `#991B1B` | `#451A03` |
| `gold_rush` | **Gold Rush** | Premium | 300 Diamonds | `#FEFCE8` | `#FEF08A` | `#CA8A04` | `#7F1D1D` | `#422006` |
| `holographic`| **Holographic**| Premium | 400 Diamonds | `#FDF4FF` | `#FAE8FF` | `#C026D3` | `#0F172A` | `#4A044E` |
| `void` | **Void** | Premium | 500 Diamonds | `#F8FAFC` | `#E2E8F0` | `#334155` | `#EF4444` | `#0F172A` |

### Theme Purchasing & Equipping Rules
- Require a confirmation dialog before spending Coins, spending Diamonds, or equipping a theme (showing exact theme name, currency, and price).
- Purchasing and equipping are separate actions. After purchasing, show a success state, updated balance, and an **Apply** button.
- If the user lacks funds, display a clear shortfall message with a direct shortcut button to the **Coins** or **Diamonds** Shop tab.

---

## 6. Backend Architecture & Purchase Handling

Tap Arcade supports two backend operational models:
1. **Free / Spark Plan (Default, $0.00 Cost):** Uses direct Cloud Firestore atomic transactions with user-isolated security rules. Zero cloud bill, no Google Cloud Blaze account required.
2. **Optional Blaze Backend:** Uses Firebase Cloud Functions 2nd Gen (`functions/src/index.ts`) for server-side Google Play Developer API verification.

### Firestore Schema
1. `users/{uid}`:
   - `uid: string`
   - `email: string`
   - `diamondBalance: number` (integer >= 0)
   - `ownedPremiumThemes: string[]`
   - `createdAt: Timestamp`, `updatedAt: Timestamp`
2. `diamond_purchases/{purchaseTokenHash}` (Indexed by `uid` and `purchaseToken` for instant manual lookup):
   - `uid: string`
   - `userEmail: string`
   - `productId: string`
   - `purchaseToken: string`
   - `diamondsGranted: number`
   - `status: "CREDITED" | "PENDING" | "FAILED"`
   - `createdAt: Timestamp`
3. `theme_transactions/{operationId}` (Idempotency & audit ledger):
   - `operationId: string`
   - `uid: string`
   - `themeId: string`
   - `diamondCost: number`
   - `createdAt: Timestamp`

### Backend Endpoints & Architecture (`BackendRepository.kt`)
1. `syncAccountState`: Initializes `users/{uid}` if new, and returns authoritative `{ diamondBalance, ownedPremiumThemes }`.
2. `verifyDiamondPurchase`:
   - Accepts `{ productId, purchaseToken }`.
   - Hashes `purchaseToken` via SHA-256 for idempotent receipt storage.
   - Runs atomic Firestore `runTransaction`:
     - Checks `diamond_purchases/{purchaseTokenHash}`. If already processed, returns current balance idempotently without double-crediting.
     - Credits the exact diamond quantity mapped in `DiamondPackCatalogue`.
     - Writes the immutable receipt record to `diamond_purchases`.
   - Consumes the purchase via Play Billing Library `consumePurchase` so the consumable item can be repurchased.
3. `purchasePremiumTheme`:
   - Runs atomic Firestore `runTransaction` using client-supplied `operationId` for idempotency.
   - Verifies user diamond balance against `AllThemes` diamond price.
   - Atomically deducts diamonds, appends theme to `ownedPremiumThemes`, and logs to `theme_transactions`.
4. `reconcilePurchases`: Bulk-reconciles unconsumed tokens on app start / recovery.
5. `deleteUserAccount`: GDPR-compliant account deletion (removes `users/{uid}` and Auth user).

---

## 7. Navigation, UI Screens, Sound, and Accessibility
### Bottom Navigation (Hidden during Gameplay & Welcome/Connection Gate)
1. **Home:** Prominent **Play** button, compact Coin balance (taps to Shop -> Coins), compact Diamond balance (taps to Shop -> Diamonds), Personal Best, Equipped Theme badge, and 3-bullet rules summary.
2. **Themes:** Categorized tabs/sections (Free, Coin, Premium) with static preview swatches, ownership badges, and Buy/Apply actions.
3. **Shop:** Two tabs (**Coins** and **Diamonds**). Coins tab explains how coins are earned in-game and links to Coin Themes. Diamonds tab displays the 6 Google Play packs with live localized prices, inline `"Processing..."` spinners during purchase, `"Purchase pending"` state handling, and a **Restore Purchases** button.
4. **Profile:** Local stats (Personal Best, Completed Games, Total Playtime formatted as `Xh Ym Zs`), Owned Themes count, Sound Effects toggle (enabled by default), local storage disclosure notice, **Sign Out**, and **Delete Account** (2-step confirmation flow with re-authentication).

### Sound & Accessibility
- **6 Procedural Sound Effects:** Target Tap, Positive Score, Hazard/Missed Target, Life Loss, Countdown Tick/Go, and Game Over. Stop audio immediately on Pause, Backgrounding, Interruption, or Game Over.
- **Accessibility:** Respect system font scaling, provide `contentDescription` on all interactive icons/canvas elements for TalkBack, enforce `48.dp` minimum touch targets, and never rely on color alone for hazards or transaction states.

---

## 8. Locked Repository Structure
Use this exact package and file organization so all phases compile cleanly together:

```text
tap-arcade/
├── .gitignore
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/libs.versions.toml
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/index.ts
│   └── test/backend.test.ts
├── firestore.rules
├── firestore.indexes.json
├── docs/
│   ├── privacy-policy.md
│   └── SETUP_AND_RELEASE_GUIDE.md
└── app/
    ├── build.gradle.kts
    ├── src/main/AndroidManifest.xml
    ├── src/main/res/drawable/ic_launcher_foreground.xml
    ├── src/main/java/com/yourstudio/taparcade/
    │   ├── TapArcadeApp.kt
    │   ├── MainActivity.kt
    │   ├── di/AppModule.kt
    │   ├── domain/model/
    │   │   ├── ThemeConfig.kt
    │   │   ├── DiamondPack.kt
    │   │   ├── UserAccountState.kt
    │   │   └── LocalStats.kt
    │   ├── data/
    │   │   ├── local/LocalDataStore.kt
    │   │   ├── network/ConnectivityObserver.kt
    │   │   ├── auth/AuthRepository.kt
    │   │   ├── backend/BackendRepository.kt
    │   │   └── billing/BillingRepository.kt
    │   ├── audio/SoundSynthesizer.kt
    │   ├── engine/
    │   │   ├── GameModels.kt
    │   │   ├── DifficultyCalculator.kt
    │   │   └── GameEngineViewModel.kt
    │   └── ui/
    │       ├── navigation/TapArcadeNavHost.kt
    │       ├── gates/ConnectionRequiredScreen.kt
    │       ├── welcome/WelcomeScreen.kt
    │       ├── home/HomeScreen.kt
    │       ├── gameplay/GameplayScreen.kt
    │       ├── themes/ThemesScreen.kt
    │       ├── shop/ShopScreen.kt
    │       └── profile/ProfileScreen.kt
    └── src/test/java/com/yourstudio/taparcade/
        └── GameAndEconomyUnitTest.kt

---

## 9. Current Implementation & Device Verification Status (Updated: October 2026)

### ✅ Completed & Device-Verified Features (100% Tested on Hardware)
- **Active Package ID:** Configured and active as `com.ekteder.taparcade`.
- **System & Memory Optimization:** Tuned `gradle.properties` (`-Xmx1536m`, `parallel=false`, `workers.max=2`, `vfs.watch=false`) to ensure stable compilation on 8GB RAM Linux workstations without crashing.
- **Authentication:** Google Sign-In via Credential Manager (`androidx.credentials` + `googleid`) verified working on physical device.
- **Game Engine & Lifecycle:**
  - 3-2-1-Go countdown sequence working with procedural audio cues.
  - Resolved `MonotonicFrameClock` crash by driving `withFrameNanos` game loop from `GameplayScreen`'s `LaunchedEffect` into `GameEngineViewModel.processFrame`.
  - Target tap (+10 pts) and expiry (-1 life) mechanics verified.
  - Hazard tap (-1 life + buzzy tone) and safe natural expiry (0 life loss) verified.
  - Multi-tap deduplication verified (prevents double scoring/life deduction).
  - Difficulty progression after 30 seconds verified.
- **Pause & Navigation:**
  - HUD pause button freezes canvas, halts audio, and presents Resume/Restart/Home options.
  - Android system Back button/gesture correctly redirects to the Pause overlay.
  - Abandon run confirmation modal verified.
- **Interruption & Network Policy:**
  - App backgrounding/minimization triggers non-dismissible interruption screen and awards 0 coins.
  - Network loss triggers "Connection Required" gate and automatically dismisses upon reconnection.
- **Economy & Persistence:**
  - Local coin economy, +X animated count-up, personal best badge, and DataStore persistence verified across sign-out and sign-in.
  - Coin theme purchasing and equipping verified.
  - Procedural sound synthesizer and profile sound toggle fully functional.
- **Backend & Cloud Firestore:**
  - Production security rules (`firestore.rules`) active and verified on live Firebase project (`tap-arcade`).
  - Authoritative user account creation (`users/{uid}`) and sync state verified on live database (`asia-southeast1`).
  - Debug SHA-1 certificate fingerprint registered and active in Firebase Console.

### ⏳ Remaining Release Tasks
1. **Google Play Console In-App Products:** Register the 6 consumable Diamond SKU placeholders (`taparcade_diamonds_70` to `taparcade_diamonds_2000`) in Google Play Console under Managed Products.
2. **License Testing:** Add tester Google accounts to Play Console License Testing to test diamond purchases at $0.00.
3. **Keystore Generation & Release Signing:** Generate production upload keystore, configure `signingConfigs` in `app/build.gradle.kts`, and add release SHA-1 to Firebase Console.
4. **Signed Release Build:** Run `./gradlew bundleRelease` to generate `app-release.aab` and upload to Play Console Internal Testing track.
