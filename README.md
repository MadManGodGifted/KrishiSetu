# Krishi Setu — कृषि सेतु

**AI-powered farming assistant for Indian farmers.**

Krishi Setu helps a farmer pick the right crop for the current season, estimate yield and income, check farm health, talk to an advisor, and connect with buyers — in English, Hindi, or Marathi.

Built as a **Smart India Hackathon** MVP with React Native and Expo. This is a working product demo, not a live production backend.

[Open on GitHub](https://github.com/MadManGodGifted/KrishiSetu)

---

## What the app does

Farmers should not have to read raw soil tables, NDVI numbers, or mandi CSVs. Krishi Setu turns that data into simple answers:

| Instead of… | The app shows… |
|---|---|
| NDVI = 0.62 | Vegetation health — Good |
| Soil moisture = 42% | Water stress — Low |
| A ranked crop catalog | “Best match for this season on your land” |

The demo farm is **Ramesh Patil**, 4.5 acres in **Nashik, Maharashtra** (black cotton soil, borewell + drip). Recommendations follow the Indian crop calendar automatically: **Kharif** (Jun–Oct), **Zaid** (Apr–May), **Rabi** (the rest of the year).

---

## Features

### Home
Greeting, live-style weather card, farm summary, and quick actions for Recommend, Yield, Farm health, and AI advisor. Recent recommendation and yield forecast sit on the same screen.

### Crop recommendation
Tap **Find Crops**. The app ranks crops for the **current Indian season** using the saved farm profile — location, soil, topology (plains / plateau / hills / valley / coastal / lowland), water need, resilience, MSP support, and market demand. No extra form filling.

Each crop card opens:

- **Details** — why it fits, soil & weather advisory, NPK, duration, water need, expected yield, income vs input cost, government schemes (e.g. PM-KISAN).
- **Buyers** — APMC / mandi price, contract farming quantity, pickup, and expected earnings.

### Yield prediction
Official-style yield report for KVK and bank officers:

- Expected yield (q / acre) and estimated revenue
- Local mandi rate vs **MSP**
- Multi-year yield trend chart
- Soil / weather risk and a recommended action schedule
- Model confidence
- **Download PDF** and **Share to WhatsApp**
- Text-to-speech (“Listen”) when voice assistant is on

### Farm health
Simple status cards — Soil, Water, Weather, Vegetation, Risk — each with a score, a short description, and a tap-to-expand parameter list. The UI explains outcomes, not sensor dumps.

### AI advisor
Chat UI with suggested questions. This preview uses scripted replies (not a live LLM). Voice mic is UI-only in the demo.

### Profile
Farmer ID, PM-KISAN / Aadhaar verified badges, farm switcher (plots, survey / khasra, soil health card, past crops), language, voice assistant, preferred mandi, WhatsApp / SMS alert toggles, and a one-tap **Kisan Call Centre** dial (`1800-180-1551`).

### Reports
Yield reports and contract-farming agreements can be previewed and printed / saved as PDF.

### Languages
**English · हिन्दी · मराठी** — switch anytime from Profile. Voice assistant reads reports and alerts in the matching locale (`en-IN` / `hi-IN` / `mr-IN`).

---

## Screens (navigation)

Bottom tabs: **Home · Recommend · Advisor · Profile**

Other screens (opened from actions, not tabs):

- Yield prediction — `/yield`
- Farm health — `/farm-health`
- Crop details — `/crop/[id]`
- Buyers / contracts — `/crop/buyers`
- PDF report — `/report`

---

## Tech stack

| Layer | Choice |
|---|---|
| App | React Native 0.81 + Expo SDK 54 |
| Routing | Expo Router (file-based) |
| Language | TypeScript |
| UI | Custom component kit, Reanimated, Gesture Handler, SVG, Chart Kit |
| Fonts | Manrope |
| Data | Local crop catalog, dummy farm profile, cached recommendations |
| Location lookup | OpenStreetMap Nominatim (when used) |

There is **no separate backend folder in this repo**. Crop ranking, yield reports, farm health, advisor replies, and mandi prices currently run **on device** from catalog + demo data so the app is easy to clone and run.

---

## Prerequisites

Install these once on your machine:

1. **Node.js 18+** (20 LTS recommended) — [nodejs.org](https://nodejs.org)
2. **Git**
3. **npm** (comes with Node)
4. For a **physical phone**: the **Expo Go** app
   - [Android — Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS — App Store](https://apps.apple.com/app/expo-go/id982107779)
5. Optional: Android Studio (emulator) or Xcode (iOS Simulator, macOS only)

---

## Setup (for anyone cloning the repo)

```bash
git clone https://github.com/MadManGodGifted/KrishiSetu.git
cd KrishiSetu/frontend
npm install
```

That is the whole install. No API keys, `.env` files, or database.

---

## Commands

Run these from the **`frontend`** folder.

| Command | What it does |
|---|---|
| `npm start` | Start the Expo dev server (QR code + menu) |
| `npm run android` | Open on a connected Android device / emulator |
| `npm run ios` | Open on iOS Simulator (macOS only) |
| `npm run web` | Open in a browser |

Same thing with Expo CLI directly:

```bash
npx expo start
npx expo start --android
npx expo start --ios
npx expo start --web
npx expo start --tunnel
npx expo start --clear
```

Useful Expo keyboard shortcuts once the server is running:

| Key | Action |
|---|---|
| `a` | Open Android |
| `i` | Open iOS simulator |
| `w` | Open web |
| `r` | Reload the app |
| `m` | Toggle the developer menu |
| `c` | Clear cache / reopen CLI menu |

Stop the server with `Ctrl + C`.

---

## How to run it on a phone

This is the path most people should use.

### 1. Install Expo Go

On the phone, install **Expo Go** from the Play Store (Android) or App Store (iPhone).

### 2. Start the project on your computer

```bash
cd KrishiSetu/frontend
npm install
npm start
```

A QR code appears in the terminal (and in the browser tab Expo opens).

### 3. Connect phone and computer

**Same Wi‑Fi (easiest)**

- Phone and laptop must be on the **same Wi‑Fi network**.
- Some campus / office Wi‑Fi blocks device-to-device traffic. If the QR scan spins forever, use tunnel mode (below).

**Android**

1. Open **Expo Go**.
2. Tap **Scan QR code**.
3. Scan the QR from the terminal.

**iPhone**

1. Open the **Camera** app (not Expo Go first).
2. Scan the QR code.
3. Tap the banner to open in **Expo Go**.

The first load can take 30–60 seconds while Metro bundles the app. After that, reloads are fast.

### 4. If the QR code does not connect — tunnel mode

Same Wi‑Fi is blocked on many networks. Tunnel sends the bundle through Expo’s servers so the phone can load it from anywhere (slightly slower):

```bash
npx expo start --tunnel
```

Scan the **new** QR code. First tunnel start may install `@expo/ngrok` — let it finish.

### 5. USB (Android)

1. Enable **Developer options** and **USB debugging** on the phone.
2. Plug in the USB cable and accept the debug prompt.
3. From `frontend`:

```bash
npm run android
```

### Reloading while you develop

- Shake the phone → **Reload**
- Or press `r` in the terminal
- Saving a file hot-reloads the UI

---

## How to run it without a phone

### Web browser

```bash
cd frontend
npm run web
```

Opens at `http://localhost:8081` (Expo may use another port; follow the terminal). Good for a quick look; some native bits (haptics, share sheet, tel: helpline) are limited on web.

### Android emulator

1. Install [Android Studio](https://developer.android.com/studio) and a virtual device.
2. Start the emulator.
3. `npm run android` from `frontend`.

### iOS Simulator (Mac only)

```bash
npm run ios
```

---

## How to use the app (once it is open)

1. **Home** — you land here as Ramesh. Check weather and farm summary, then tap a quick action.
2. **Recommend → Find Crops** — ranked list for this season. Open a crop for why it was chosen.
3. **Buyers** — pick a buyer, quantity, and generate a contract-style report.
4. **Yield** — yield, revenue, MSP comparison, chart, PDF, WhatsApp share.
5. **Farm health** — tap **View details** on a card for the full parameter list.
6. **Advisor** — tap a suggested question or type one.
7. **Profile** — switch language (EN / हिन्दी / मराठी), turn voice on, pick a mandi, call the helpline.

---

## Project structure

```
KrishiSetu/
├── README.md                 ← you are here
├── design.md                 ← UI / UX guidelines
├── arc.md                    ← original architecture notes
└── frontend/                 ← Expo app (run commands from here)
    ├── app/                  ← screens (Expo Router)
    │   ├── (tabs)/           ← Home, Recommend, Advisor, Profile
    │   ├── crop/             ← crop details + buyers
    │   ├── farm-health.tsx
    │   ├── yield.tsx
    │   └── report.tsx
    ├── components/           ← UI, cards, charts, navigation
    ├── constants/            ← crops, i18n, theme, dummy farm, mandi
    ├── context/              ← language + settings
    ├── lib/                  ← ranking, season, farm profile, PDF, cache
    └── assets/images/        ← app icon, splash, crop / product photos
```

---

## How recommendations work (short)

1. Read the saved **farm profile** (location, acres, soil, irrigation).
2. Infer **topology** from location (e.g. Nashik → Deccan plateau).
3. Detect **current Indian season** from today’s month.
4. Filter the crop catalog to that season, drop weak topology fits, and score each crop on fit, water vs land type, resilience, MSP, demand, and a Nashik bonus for local specialities.
5. Sort by score, then net income per acre.

Yield reports combine catalog yield (q / acre) × farm size, mandi vs MSP rates, and a scheduled advisory. Market quotes are cached locally and jittered slightly to simulate a live APMC tick.

---

## Demo data vs future APIs

This MVP is meant to show the **decision-support UX**. Catalog crops, farm health, advisor answers, and most prices are **demo data** so anyone can run the app with zero keys.

The architecture doc (`arc.md`) describes swapping those sources later for:

- Krishi DSS
- AgriStack
- Soil Health Card API
- IMD / Open-Meteo weather
- Live mandi APIs

The frontend screens are already shaped around “simple insights,” so those APIs can land behind the same cards.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm` / `expo` not found | Install Node 18+ and reopen the terminal |
| QR scan hangs on “Connecting…” | Phone and PC on different Wi‑Fi, or AP isolation. Use `npx expo start --tunnel` |
| “Something went wrong” in Expo Go | SDK mismatch — this project is **Expo 54**. Update Expo Go from the store |
| Stale bundle / weird errors | `npx expo start --clear` |
| `npm install` fails | Delete `frontend/node_modules` and `frontend/package-lock.json`, then `npm install` again |
| Android USB does nothing | Enable USB debugging; run `adb devices` and confirm the phone is listed |
| iOS Simulator missing | Needs a Mac with Xcode |
| Fonts flash / splash stuck | Wait 2s — layout falls through if fonts are slow; reload with `r` |
| Port already in use | Ctrl+C the old Expo process, or allow Expo to pick another port |

---

## Design notes

The product should feel like a **premium AI assistant**, not a government portal: green primary (`#2E7D32`), lots of white space, one primary action per screen, large type, rounded cards. Full language is in [`design.md`](./design.md).

---

## License

Private / hackathon project unless otherwise stated by the authors.

---

**Krishi Setu** — bridging the farmer and a clear decision.
)
