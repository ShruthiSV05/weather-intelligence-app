# AetherCast - Weather Intelligence App

A professional, intelligence-driven weather dashboard built using React, Vite, and Tailwind CSS. The app delivers current meteorological reports, interactive charts, and tailored outdoor/health recommendations powered strictly by public Open-Meteo APIs. Now enhanced with powerful multi-city intelligence.

## 🌟 Project Features

- **Multi-City Concurrent Search**: Enter multiple cities separated by commas (e.g., *London, Paris, Tokyo*) in a single search query. The application automatically detects the mode and queries all targets simultaneously.
- **Concurrent High Performance**: Fetches all geocoding coordinates and forecast stats concurrently using `Promise.all()` to minimize latency.
- **Deduplication & Safety Constraints**: Automatically trims whitespace, deduplicates redundant cities case-insensitively (e.g., *Paris, paris* is fetched once), and limits processing to a maximum of 10 concurrent cities to comply with public API rate limits.
- **Flexible Grid Layout**: Shows all loaded cities side-by-side in a responsive card grid, adapting from single-column mobile lists to beautiful bento-style grids on desktop monitors.
- **Intelligent Fault Tolerance**:
  - If a single city in a list of searches is invalid, the dashboard continues processing the rest and prints a distinct, inline warning card (*"No matching results found for 'InvalidCity'."*) in place of that city.
  - If all queried cities are invalid, a friendly global error message is shown asking the user to double-check their spelling.
- **Interactive Deep-Dive Details**: Click any loaded card in the grid to instantly shift the detailed 7-day forecast cards, custom smart advisories, dynamic theme accents, and temperature trend charts to that active city.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Framework**: React 19 (TypeScript)
- **Bundler / Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **Charts / Visualizations**: Recharts
- **Icon Set**: Lucide React
- **Animations**: Motion (by Framer)

---

## 🚀 Getting Started Locally

Follow these quick commands to spin up the application on your computer:

### 1. Installation
Clone or download the workspace, navigate to the project directory, and install dependencies:
```bash
npm install
```

### 2. Run in Development
Boot the Vite development server locally on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 3. Build for Production
Bundle the static assets with optimized minification and module-splitting:
```bash
npm run build
```
The compiled build output will be stored inside the `/dist` folder.

---

## ☁️ Deployment Instructions

This applet runs entirely client-side, making it highly suited for hosting on static networks like **Cloudflare Pages**, **Vercel**, or **GitHub Pages**.

### Cloudflare Pages Deployment Configuration

When setting up your repository on Cloudflare Pages, use the following configuration guidelines:

1. **Framework Preset**: `Vite`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**: No API keys are required! The Open-Meteo API is completely free and public.

---

## 🧪 Verification Checklists

Verify the correctness and visual state of the application using these test scenarios:

### 1. Two Valid City Searches
- Search for **"London"**: Should return reports for England, United Kingdom with cool weather graphics.
- Search for **"Tokyo"**: Should correctly pull the current Tokyo forecast and update the recent searches ribbon.

### 2. One Invalid City Search
- Type a sequence of random characters (e.g., `xyzqweasdzxc`) and click **Search**.
- Verify that a friendly error message displays indicating that no matching results were found and to check spelling.

### 3. Empty Search Validation
- Leave the textbox completely blank and hit **Search**.
- Verify that the app halts the search and displays a prompt: *"Please enter a city name to search."*

### 4. Loading & Error States
- Look at the smooth spinner when loading.
- Look at the offline and failed fetch layouts when APIs are unreachable.

### 5. Responsive Layout
- Resize your browser window or inspect the page in Chrome DevTools using mobile device emulation (e.g. iPhone SE, iPad Pro).
- Ensure cards stack, grids shrink into standard double columns on mobile, and chart lines scale gracefully without overflowing parent bounds.
