# Connect — Services & Community

Lightweight app for connecting with others and local government services. Built for slow connections and small screens. No location data unless the user opts in or in emergency/missing persons use.

## Requirements met

1. **Android app that also works on desktop** — Web app runs in any browser (Android Chrome, desktop). Use Capacitor to build the Android (and iOS) native shell (see Export below).
2. **Test in HTML** — Run `npm run dev` and open the URL in a browser; or open `dist/index.html` after `npm run build`.
3. **Export for iOS** — Same codebase. Build the web app, then add the iOS platform with Capacitor (`npx cap add ios`). Build and open in Xcode for App Store export.
4. **Lightweight, slow connections, small screens** — Vanilla JS, minimal CSS, no heavy frameworks. Single small bundle. Mobile-first CSS and 44px tap targets.
5. **No location unless agreed or emergency** — Location is never requested unless the user taps “Use my location” (Services) or “Share location for emergency/missing person”. No background or passive collection.

## Quick start

```bash
cd homeless-connect-app
npm install
npm run dev
```

Open the URL shown (e.g. http://localhost:5173) in a browser to test.

## Build for production

```bash
npm run build
```

Output is in `dist/`. You can deploy that to any static host or use it inside the native app.

## Export as Android app

The project includes Capacitor; the Android app runs as a **standalone fullscreen app** (no browser chrome).

1. Install dependencies and add the Android platform (first time only):

   ```bash
   npm install
   npx cap add android
   ```

2. Build the web app, then sync:

   ```bash
   npm run build
   npx cap sync
   ```

3. Open in Android Studio and run or create a release bundle:

   ```bash
   npx cap open android
   ```

   The app displays in fullscreen; layout is tuned for 9:16 portrait phones and works on tablets.

## Export as iOS app

1. Add the iOS platform (requires macOS with Xcode):

   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/ios
   npx cap add ios
   ```

2. Build and sync:

   ```bash
   npm run build
   npx cap sync ios
   npx cap open ios
   ```

3. In Xcode, select your team and device/simulator, then Archive for App Store or run on device.

## Project structure

- `index.html` — Single entry HTML (testable in browser).
- `src/main.js` — Router and app entry.
- `src/style.css` — Global, mobile-first styles.
- `src/lib/layout.js` — Shared header/footer layout.
- `src/lib/location.js` — Opt-in location helpers; no collection without consent.
- `src/pages/` — Home, Connect (community), Services, Privacy, Emergency/Missing person.

## Privacy & location

- **Default:** No location is collected or stored.
- **Opt-in:** On Services, user can tap “Allow for this search” to use location once for “near me”; consent is stored locally so we can show “Show all / clear” on next visit.
- **Emergency / missing person:** Dedicated page with explicit “I agree — share location for this purpose” before any location is used.
