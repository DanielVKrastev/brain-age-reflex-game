# Brain Age Reflex Game

An interactive cognitive speed, memory, focus, and mental math game (`Brain Age`) built with React, TypeScript, and Capacitor for web and mobile devices (Android / iOS), with full localization support (`BG` / `EN`).

---

## Key Features

* **Mini-Games & Levels:** Reaction time, memory, number hunt, Stroop test, and math blitz challenges alongside a level progression mode.
* **Brain Age Evaluation & History:** Computes an overall index (`overallScore`), estimated `brainAge`, delta comparison against the previous session, and recent attempts history.
* **Rank Share Card (`ResultShareCardModal`):** Renders a high-resolution PNG card (`1080x1350`) on HTML5 `<canvas>` in a trading PnL card style complete with a rank badge (`TIER S`, `TIER A`, `TIER B`, `TIER C`), overall score, and per-game breakdowns.
* **Native Mobile Sharing & File Export (`shareCardFile.ts`):** Uses `@capacitor/filesystem` and `@capacitor/share` on native platforms, with browser fallbacks for Web Share API and `.png` downloads.
* **Issue Reporting (`ReportIssueModal`):** Attaches automatic session context (locale, platform, current screen, active game/level, and timestamp) with clipboard copy and `mailto:` support.
* **Localization (`BG` / `EN`):** Centralized translations in `src/i18n/translations.ts` covering the UI, modals, rank tiers, and rendered share cards.

---

## Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Mobile Runtime:** Capacitor (`@capacitor/core`, `@capacitor/filesystem`, `@capacitor/share`)
* **Graphics & Export:** HTML5 Canvas API (`toDataURL` / `toBlob`)

---

## Project Structure (Core Modules)

```text
src/
├── components/
│   ├── LevelsScreen.tsx
│   ├── ReportIssueModal.tsx
│   ├── ResultCard.tsx
│   └── ResultShareCardModal.tsx
├── i18n/
│   └── translations.ts
├── types/
│   └── game.ts
├── utils/
│   ├── historyStorage.ts
│   └── shareCardFile.ts
└── App.tsx
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

---

## Mobile Build with Capacitor (Android)

After installing `@capacitor/filesystem` and `@capacitor/share`:

```bash
npm run build
npx cap sync
npx cap open android
```

Use Android Studio to run the app on an emulator or device and generate a signed **Android App Bundle (`.aab`)** for Google Play Console.

---

## Share Card Rank Tiers

Rank tiers are determined from `overallScore` (`0–100`):

* **TIER S (`APEX MIND`):** `85` and above
* **TIER A (`PRO FOCUS`):** `70 – 84`
* **TIER B (`ACTIVE`):** `50 – 69`
* **TIER C (`WARMUP`):** below `50`
