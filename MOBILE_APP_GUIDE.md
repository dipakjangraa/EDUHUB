# 📱 EDUHUB Mobile App — Play Store & App Store Guide

## What We're Using
**Capacitor** — wraps your existing Next.js web app into a native Android/iOS app.
- Same codebase for web + Android + iOS
- Access to native features (camera, notifications, etc.)
- Publish to Play Store and App Store

---

## 🛠️ Prerequisites

### For Android (Play Store):
- **Android Studio** — Download from https://developer.android.com/studio
- **Java JDK 17+** — Usually bundled with Android Studio
- **Google Play Developer Account** — $25 one-time fee at https://play.google.com/console

### For iOS (App Store):
- **Mac computer** — Required (iOS builds only work on Mac)
- **Xcode** — Free from Mac App Store
- **Apple Developer Account** — $99/year at https://developer.apple.com

---

## 🚀 Step-by-Step: Build Android App

### Step 1 — Find your PC's local IP address
Open Command Prompt and run:
```
ipconfig
```
Look for "IPv4 Address" — something like `192.168.1.100`

### Step 2 — Update capacitor.config.ts
Open `eduhub/capacitor.config.ts` and replace the URL:
```ts
server: {
  url: 'http://YOUR_IP_HERE:3000',  // e.g. http://192.168.1.100:3000
  cleartext: true,
},
```

### Step 3 — Add Android platform
```bash
cd eduhub
npx cap add android
```

### Step 4 — Sync your app
```bash
npx cap sync android
```

### Step 5 — Open in Android Studio
```bash
npx cap open android
```
Android Studio will open with your project.

### Step 6 — Run on device/emulator
In Android Studio:
1. Click "Run" (▶️ green button)
2. Select your device or emulator
3. App will install and open

### Step 7 — Make sure dev server is running
In a separate terminal:
```bash
cd eduhub
npm run dev
```
Your phone and PC must be on the same WiFi network.

---

## 📦 Build for Production (Play Store)

### Step 1 — Enable static export
In `next.config.js`, uncomment the output line:
```js
output: 'export',
```

### Step 2 — Build the static app
```bash
npm run build
```
This creates an `out/` folder.

### Step 3 — Sync to Android
```bash
npx cap sync android
```

### Step 4 — Generate signed APK/AAB in Android Studio
1. Open Android Studio: `npx cap open android`
2. Go to **Build → Generate Signed Bundle/APK**
3. Choose **Android App Bundle (.aab)** — required for Play Store
4. Create a new keystore (save the password safely!)
5. Build the release bundle

### Step 5 — Upload to Play Store
1. Go to https://play.google.com/console
2. Create new app
3. Fill in app details, screenshots, description
4. Upload the `.aab` file
5. Submit for review (takes 1-3 days)

---

## 🍎 Build for iOS (App Store)

> **Requires a Mac with Xcode installed**

### Step 1 — Add iOS platform
```bash
npx cap add ios
npx cap sync ios
```

### Step 2 — Open in Xcode
```bash
npx cap open ios
```

### Step 3 — Configure signing
1. In Xcode, select your project
2. Go to **Signing & Capabilities**
3. Select your Apple Developer Team
4. Set Bundle Identifier: `com.eduhub.app`

### Step 4 — Build for release
1. Select **Any iOS Device** as target
2. Go to **Product → Archive**
3. In Organizer, click **Distribute App**
4. Choose **App Store Connect**
5. Upload to App Store Connect

### Step 5 — Submit on App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Create new app
3. Fill in metadata, screenshots
4. Submit for review (takes 1-7 days)

---

## 📱 App Details to Fill In

### App Name: EDUHUB
### Bundle ID: com.eduhub.app
### Category: Education
### Description:
```
EDUHUB - India's Smartest Exam Prep App

Prepare for SSC, Bank PO, UPSC, NEET, JEE and more with unlimited AI-generated questions.

Features:
• Unlimited unique questions powered by Google Gemini AI
• Personal AI Teacher that explains in Hinglish
• Smart weak point analysis
• Real-time 1v1 Battle Mode
• Daily challenges with XP rewards
• Leaderboard & achievements
• Works offline (cached questions)

Free to use. No credit card needed.
```

### Keywords: exam prep, SSC, Bank PO, UPSC, NEET, JEE, quiz, AI, study

---

## 🎨 App Store Assets Needed

### App Icon (required):
- 1024x1024 PNG (no transparency)
- Design: Dark background (#030712) with ⚡ EDUHUB text

### Screenshots (required):
- At least 3 screenshots
- Show: Login page, Dashboard, Quiz page, Results page
- Take screenshots on your phone while running the app

### Feature Graphic (Play Store):
- 1024x500 PNG
- Show the app's main features

---

## ⚡ Quick Commands Reference

```bash
# Add platforms (first time only)
npx cap add android
npx cap add ios

# Sync after code changes
npx cap sync

# Open in IDE
npx cap open android
npx cap open ios

# Run dev server (keep running while testing)
npm run dev
```

---

## 🐛 Common Issues

### "App shows blank screen on phone"
- Make sure `npm run dev` is running
- Check your IP in `capacitor.config.ts` is correct
- Phone and PC must be on same WiFi

### "Cannot connect to server"
- Check Windows Firewall — allow port 3000
- Try: `netsh advfirewall firewall add rule name="Node 3000" dir=in action=allow protocol=TCP localport=3000`

### "Build fails"
- Make sure Android Studio is installed
- Run `npx cap sync` before opening Android Studio

---

## 💰 Cost Summary

| Item | Cost |
|------|------|
| Google Play Developer | $25 one-time |
| Apple Developer | $99/year |
| Hosting (Vercel) | Free |
| AI APIs | Free tier |
| **Total to launch** | **$25 (Android only)** |

---

## 🚀 Fastest Path to Launch

1. Install Android Studio (free)
2. Run `npx cap add android`
3. Run `npx cap sync android`
4. Run `npx cap open android`
5. Build signed AAB
6. Pay $25, upload to Play Store
7. Wait 1-3 days for approval
8. **Your app is live!** 🎉
