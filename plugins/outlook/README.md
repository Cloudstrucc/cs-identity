# DIDComm Outlook Add-In Setup Guide

This guide walks you through setting up an Outlook Add-In to enable sending and decrypting emails encrypted using Decentralized Identity (DID) and DIDComm messaging, optionally backed by WebAuthn or hardware keys.

---

## 🧩 Features

* Toolbar button in Outlook to decrypt DIDComm messages
* Taskpane for interacting with your DID wallet (signing/decryption)
* Compatible with WebAuthn-enabled wallets or hardware keys (YubiKey, Ledger, etc.)

---

## 🔧 Prerequisites

* Node.js and npm installed
* Outlook desktop or Outlook Web (O365)
* HTTPS-accessible web hosting for taskpane UI (or localhost via tunneling)

---

## 📁 Project Structure

```bash
outlook-didcomm-addin/
├── manifest.xml               # Add-in manifest file
├── taskpane.html             # UI loaded in Outlook
├── taskpane.js               # JavaScript logic for DID/WebAuthn
├── assets/                   # Icons (16x16, 32x32, 80x80)
├── server.js (optional)     # Express server to host locally
```

---

## ⚙️ Step-by-Step Implementation

### 1. Clone or create your add-in folder

Use the [Yo Office generator](https://docs.microsoft.com/en-us/office/dev/add-ins/quickstarts/outlook-quickstart) if needed:

```bash
npx yo office
```

Choose: `Outlook Add-in`, `Message Read + Compose`, `JavaScript`

### 2. Replace the generated `manifest.xml` with the one we created.

Make sure icon URLs and taskpane URLs point to your environment (e.g., `localhost:3000`, `ngrok`, or deployed URL).

### 3. Create `taskpane.html`

```html
<!DOCTYPE html>
<html>
<head><title>DIDComm Decryptor</title></head>
<body>
  <h2>DIDComm Decryption Panel</h2>
  <button onclick="decryptDIDEmail()">Decrypt Email</button>
  <pre id="output"></pre>
  <script src="taskpane.js"></script>
</body>
</html>
```

### 4. Create `taskpane.js`

This script:

* Reads the message body
* Decrypts it using DIDComm + WebAuthn key

```javascript
Office.onReady(() => {
  window.decryptDIDEmail = async function () {
    const item = Office.context.mailbox.item;
    item.body.getAsync("text", async (result) => {
      const encrypted = result.value;
      // Call your decrypt function (DIDComm/WebAuthn integrated)
      const decrypted = await decryptWithDIDWallet(encrypted);
      document.getElementById("output").innerText = decrypted;
    });
  }
});

async function decryptWithDIDWallet(message) {
  // Use WebAuthn to unlock key, then decrypt
  return "[Decrypted message placeholder]";
}
```

### 5. Start a local HTTPS server

Use a tunneling tool like `ngrok` or use `localhost` with self-signed certs:

```bash
npx http-server -S -C cert.pem -K key.pem
```

Or create a simple Express server:

```js
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.listen(3000, () => console.log("Add-in running on https://localhost:3000"));
```

### 6. Sideload the Add-In in Outlook (Desktop or Web)

* Go to **Outlook Settings > Manage Add-ins**
* Upload your `manifest.xml`
* Click the DIDComm button in the message view

---

## 🔐 Optional: WebAuthn / YubiKey Integration

You can replace `decryptWithDIDWallet()` with a WebAuthn or hardware key logic using:

* `navigator.credentials.get()` for WebAuthn assertions
* Cryptographic libraries like `@digitalbazaar/did-io`, `didkit`, or `veramo`

This ensures that the private key never leaves the hardware device.

---

## ✅ Next Steps

* Add DIDComm 2.0 encryption/decryption
* Integrate with your own DID resolver / wallet backend
* Support message compose + signature insertion

Let me know if you'd like a template repo, a walkthrough for WebAuthn key binding, or a hosted version!
