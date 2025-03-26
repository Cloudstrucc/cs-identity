# 🏃‍♂️ Bifold Wallet — iOS Setup & Troubleshooting Guide

This single guide covers everything you need to  **install** ,  **run** , and **fix common build/runtime errors** when running Bifold on iOS Simulator.

---

## 📋 Prerequisites

* **macOS 12+** (Monterey or newer)
* **Xcode** (latest from App Store)
* **Homebrew**
* **Node.js** (v18+)
* **Yarn**
* **CocoaPods** (v1.16+)
* **Watchman** (for clearing Metro cache)

---

## ▶️ Official Bifold iOS Startup (from DEVELOPER.md)

```bash
git clone https://github.com/openwallet-foundation/bifold-wallet.git
cd bifold-wallet/packages/legacy/app
yarn install
cd ios && pod install && cd ..
yarn ios
```

> 🚨 If any errors occur during these steps, see the Troubleshooting section below.

---

## 🛠️ Troubleshooting

### 1️⃣ "xcodebuild requires Xcode" Error

**Symptom:**

```
xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance
```

**Fix:**

```bash
sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
xcode-select -p        # should output Xcode path
xcodebuild -version    # prints Xcode version
```

---

### 2️⃣ CocoaPods "visionos" & "glog" Podspec Errors

**Symptoms:**

```
Invalid `react-native-config.podspec` file: undefined method `visionos`
Invalid `glog.podspec` file: undefined method '[]' for nil.
```

**Fix:**

```bash
brew update && brew install cocoapods && brew upgrade cocoapods
pod --version        # should be >= 1.16.0
cd packages/legacy/app/ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install --repo-update
```

---

### 3️⃣ Hermes Runtime Error: "ReactCurrentOwner" & "render" Undefined

**Symptoms:**

```
TypeError: Cannot read property 'ReactCurrentOwner' of undefined, js engine: hermes
TypeError: Cannot read property 'render' of undefined
```

**Fix:** Disable Hermes (and Fabric) for iOS in Podfile:

```ruby
use_react_native!(
  :path => config[:reactNativePath],
  :hermes_enabled => false,
  :fabric_enabled => false
)
```

Then:

```bash
cd packages/legacy/app/ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ../..
watchman watch-del-all
yarn cache clean
rm -rf node_modules && yarn
rm -rf ~/Library/Developer/Xcode/DerivedData/*
yarn start --reset-cache
yarn ios
```

---

### 4️⃣ "watchman: command not found"

**Fix:**

```bash
brew install watchman
```

---

## ⚠️ Common Warnings (Safe to Ignore)

* **VisionCamera:** "react-native-worklets-core not found" → Frame Processors disabled (only needed if you use frame processors).
* **React Native version notice:** RN v0.78.1 available; Bifold targets v0.73.6 — safe to ignore.

---

🎉 After following these steps, Bifold should build and launch successfully in the iOS Simulator!

This document walks you step‑by‑step through cloning, configuring, building, and troubleshooting the **Bifold Wallet** app on **macOS** for Android (emulator or physical device).

## 📥 1️⃣ Clone the Repository

```bash
git clone https://github.com/openwallet-foundation/bifold-wallet.git
cd bifold-wallet
```

Refer to the official Developer docs: https://github.com/openwallet-foundation/bifold-wallet/blob/main/DEVELOPER.md

## 💻 2️⃣ Install Prerequisites

### Homebrew (if not installed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Node.js & Yarn

Install Node v18 (required) via nvm:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
source ~/.zshrc
nvm install 18.18.2
nvm alias default 18.18.2
node -v  # → v18.x
brew install yarn
```

## ☕ 3️⃣ Java JDK 17 Setup

```bash
brew install openjdk@17
sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v17)' >> ~/.zshrc
echo 'export PATH="$JAVA_HOME/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
java -version  # → openjdk version "17.x"
```

## 📱 4️⃣ Android SDK & Emulator

### Install Android Studio

Download from https://developer.android.com/studio and install.

### Configure Environment Variables

Add to `~/.zshrc`:

```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
```

`source ~/.zshrc`

### Create & Launch AVD

Open Android Studio → Tools → Device Manager → Create Virtual Device → choose Pixel 5 / API 33 → Finish → ▶️ Run.

Verify CLI:

```bash
emulator -list-avds
adb devices
```

## 📦 5️⃣ Install Dependencies & Run

In repo root:

```bash
yarn install
npx react-native doctor
yarn android
```

This builds and installs the app onto your running emulator.

## 🐞 Troubleshooting

| Symptom                                    | Fix                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Node version mismatch                      | Use `nvm use 18.18.2` (check with `node -v`).                                                                          |
| "No such file or directory: adb"           | Ensure ANDROID_HOME & PATH are set correctly; run `which adb`.                                                           |
| "No emulators found"                       | Create an AVD in Android Studio’s Device Manager.                                                                         |
| "JAVA_HOME is set to an invalid directory" | Update JAVA_HOME to JDK17 (`export JAVA_HOME=$(/usr/libexec/java_home -v17)`).                                           |
| Gradle error requiring Java 17             | Confirm `java -version` shows v17, not 11 or 13.                                                                         |
| Brew permission denied                     | `sudo chown -R $(whoami):admin /usr/local/Cellar/certbot /usr/local/lib/docker/cli-plugins` and re-run `brew cleanup`. |
| React Native CLI dev server port conflict  | Kill existing Metro:`lsof -i tcp:8081` → `kill -9 <PID>`.                                                             |

🎉 You’re now ready to develop, build, and debug the Bifold Wallet on Android!
