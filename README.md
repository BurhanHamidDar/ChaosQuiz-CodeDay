<div align="center">
  <img src="./assets/icon.png" alt="Chaos Quiz Icon" width="150" />
  <h1>💥 Chaos Quiz: The Fragile App 💥</h1>
  <p><strong>A uniquely destructive trivia experience built for CodeDay Kashmir 2026.</strong></p>
</div>

---

## 📖 About The Project

**Chaos Quiz** (also known as *The Fragile Quiz*) is not your standard trivia app. Built under the theme of "Chain Reaction," this app features a hilarious, cohesive narrative: **The developers ran out of budget, and the app's code is structurally unstable.**

Every time you answer a question incorrectly, you don't just lose points—you cause **physical damage** to the app. 

### ✨ Key Features
- **Progressive UI Destruction**: Watch buttons snap off their hinges and fall off the screen using gravity physics.
- **Photorealistic Damage**: High-quality, transparent cracked glass overlays burn into your screen with every wrong answer.
- **Meme Symphony**: A dynamic audio system that plays everything from happy MLG Airhorns for correct answers, to realistic shattering glass, Vine booms, and the "Emotional Damage" meme for failures.
- **The Humiliation Contract**: If you destroy the app completely, you are forced to sign a legally binding "Terms of Forgiveness" contract admitting your skill issues to earn a lifeline.
- **Cultural & Meme Trivia**: Features 35 randomized dad jokes and culturally relevant meme questions.

---

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) (with [Expo SDK 54](https://expo.dev/))
- **Animations & Physics**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- **Audio**: `expo-av`
- **Haptics**: `expo-haptics`

---

## 🚀 Local Setup & Installation

To run this project locally on your machine for development or testing:

### Prerequisites
1. Install [Node.js](https://nodejs.org/) (LTS recommended).
2. Install the [Expo Go](https://expo.dev/client) app on your physical iOS/Android device, OR set up an Android Emulator / iOS Simulator.

### Installation Steps
1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/your-username/ChaosQuiz.git
   cd ChaosQuiz
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the Expo development server**:
   ```bash
   npx expo start --clear
   ```

4. **Run the app**:
   - Press `a` in the terminal to open on an Android Emulator.
   - Or, scan the QR code using the **Expo Go** app on your physical phone.

---

## 📦 Building an APK (Android) using EAS

If you want to create a standalone `.apk` file to install on Android devices (without needing Expo Go), you will use **EAS (Expo Application Services)**.

### Step 1: Install EAS CLI
Open your terminal and install the EAS command-line tool globally:
```bash
npm install -g eas-cli
```

### Step 2: Log in to Expo
Log in to your Expo account. (If you don't have one, create it for free at [expo.dev](https://expo.dev/)):
```bash
eas login
```

### Step 3: Configure the Build
Initialize EAS in your project. This will generate an `eas.json` file:
```bash
eas build:configure
```

### Step 4: Build the APK
To build an `.apk` specifically (instead of an `.aab` for the Google Play Store), we use a "preview" profile.

Run the following command:
```bash
eas build -p android --profile preview
```
*(Note: If `eas.json` doesn't have a preview profile yet, EAS will ask if you want to set one up. Say yes, and ensure it sets `"buildType": "apk"` in the preview block).*

### Step 5: Download & Install
1. The build process will run on Expo's cloud servers (this usually takes 5-15 minutes).
2. Once finished, the terminal will provide a **download link** to your `.apk`.
3. Download the file, send it to your Android phone, and install it!

---

## 👨‍💻 Credits & Team

Proudly developed for **CodeDay Kashmir 2026**.

- **Head Developer**: Burhan Hamid
- **Team Members**: Aqsa Nazir, Tabiya Firdous, Farhan Javid.

*Built with ☕ and zero sleep.*
