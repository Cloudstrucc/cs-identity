# 🧠 Hyperledger Aries Mobile Agent Wallet - iOS Setup Guide

This guide helps you build a decentralized identity wallet app using **Aries Mobile Agent React Native** (AMARN) for  **iOS** , with customization for branding, DIDComm v2, specific credential schemas, and demo verifier/issuer services.

---

## ✅ Prerequisites

Install the following tools:

```bash
brew install node yarn watchman
npm install -g react-native-cli
```

Also ensure:

* macOS 12+
* Xcode 13.4+
* iOS Simulator or iPhone with developer account

Install CocoaPods:

```bash
sudo gem install cocoapods
```

---

## 📦 Clone and Build

```bash
git clone https://github.com/hyperledger/aries-mobile-agent-react-native.git
cd aries-mobile-agent-react-native
yarn install
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 🎨 Step 1: Customize Branding & UI

* **App Name & Icons** : Change in `Info.plist`, `App.tsx`, and `assets/` folder.
* **Screens and Components** :
* UI code lives in `src/screens/` and `src/components/`
* Update color themes in `src/theme/`

---

## ✉️ Step 2: Upgrade to DIDComm v2

Update agent configuration in `src/agent/agent.ts`:

```ts
const agent = new Agent({
  config: {
    ...,
    useDidCommV2: true,
  },
  dependencies,
  modules: {
    ...,
    // Optional: add mediation/delivery modules
  },
})
```

Update dependencies:

```bash
yarn add @aries-framework/core @aries-framework/react-native
```

Ensure mediation endpoints and connection protocols are updated for v2.

---

## 🎓 Step 3: Support Specific Credential Schema

1. Create the schema and credential definition in your agent or issuer:

```ts
await agent.modules.anoncreds.createSchema({
  name: "StudentCredential",
  version: "1.0.0",
  attributes: ["firstName", "lastName", "studentId"]
});
```

2. Accept credential offers in the wallet UI:
   Modify the credential offer flow in `src/screens/CredentialOfferScreen.tsx`.
3. Display received credentials in the wallet:
   Update credential rendering components in `src/components/CredentialCard.tsx`

---

## 🧪 Step 4: Build Demo Issuer & Verifier Services

Use `Aries Framework JavaScript` (AFJ) or the [aries-framework-express-ts](https://github.com/hyperledger/aries-framework-javascript-ext/tree/main/examples/aries-framework-express-ts) backend.

### Issuer Demo (Express + AFJ)

```bash
git clone https://github.com/hyperledger/aries-framework-javascript-ext.git
cd examples/aries-framework-express-ts
yarn install && yarn start
```

Customize `/routes/issueCredential.ts` to issue your StudentCredential schema.

### Verifier Demo

Create `/routes/presentProof.ts` to send proof requests to connected wallets:

```ts
await agent.modules.proofs.requestProof({
  protocolVersion: 'v2',
  connectionId,
  proofFormats: { indy: { requestedAttributes: {...} } },
})
```

---

## 🧪 Testing

1. Scan a QR code for connection
2. Receive and store a credential
3. Respond to a proof request from the verifier demo

---

## ✅ Resources

* [Aries Mobile Agent RN GitHub](https://github.com/hyperledger/aries-mobile-agent-react-native)
* [Aries Framework JS](https://github.com/hyperledger/aries-framework-javascript)
* [Aries RFCs (for DIDComm)](https://github.com/hyperledger/aries-rfcs)

---

## 🚀 Summary

You now have:

* A running Aries wallet on iOS
* Custom UI/branding
* DIDComm v2 enabled
* Support for a specific credential schema
* Demo services to issue and verify credentials

Perfect base for your SSI-powered identity wallet!
