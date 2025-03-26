# Identus DID Wallet - Setup Guide (REST API + CLI + UI)

This guide will help you set up a Hyperledger Identus (AFJ) DID wallet project with a REST API, CLI interface, and frontend UI integration.

---

## 🧩 Features

* REST API to create DIDs and store Verifiable Credentials (VCs)
* CLI mode for direct terminal use
* Frontend UI to interact with the wallet in the browser

---

## 📁 Project Structure

```
identus-wallet/
├── src/
│   └── index.ts          # API server + CLI logic
├── public/
│   └── index.html        # Wallet frontend UI
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone or Initialize Project

```bash
mkdir identus-wallet && cd identus-wallet
npm init -y
npm install express cors body-parser @identus/core @identus/node @hyperledger/aries-askar-nodejs @hyperledger/anoncreds-nodejs typescript ts-node-dev --save
```

### 2. Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### 3. Add NPM Scripts to `package.json`

```json
"scripts": {
  "dev": "ts-node-dev src/index.ts",
  "cli": "ts-node src/index.ts --cli"
}
```

### 4. Start the Agent API Server

```bash
npm run dev
```

* Server runs at: `http://localhost:3001`
* Endpoints:
  * `GET /did` → Creates a new DID
  * `POST /credential` → Stores a credential
  * `GET /health` → Status check

### 5. Run in CLI Mode

```bash
npm run cli
```

* Creates a DID and prints it to terminal.

---

## 🖥️ Frontend UI: `public/index.html`

Create this file in the `public/` folder:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DID Wallet</title>
  <style>
    body { font-family: sans-serif; margin: 2em; background: #f9f9f9; }
    button { margin: 1em 0; padding: 10px; font-size: 1rem; }
    pre { background: #eee; padding: 1em; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Identus DID Wallet UI</h1>
  <button onclick="createDid()">Create DID</button>
  <button onclick="storeCredential()">Store Credential</button>
  <pre id="output"></pre>

  <script>
    async function createDid() {
      const res = await fetch('http://localhost:3001/did');
      const data = await res.json();
      document.getElementById('output').textContent = 'New DID: ' + data.did;
    }

    async function storeCredential() {
      const vc = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuer: 'did:example:issuer',
        credentialSubject: {
          id: 'did:example:user123',
          name: 'Alice Doe',
          role: 'Engineer'
        },
        issuanceDate: new Date().toISOString()
      };
      const res = await fetch('http://localhost:3001/credential', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vc)
      });
      const data = await res.json();
      document.getElementById('output').textContent = 'Credential Stored. ID: ' + data.credentialId;
    }
  </script>
</body>
</html>
```

Then serve it using:

```bash
npx serve public
# or integrate in Express:
// app.use(express.static('public'))
```

Access it at: `http://localhost:3000` (or wherever hosted)

---

## ✅ Next Steps

* Add credential issuance workflow
* Integrate DIDComm for secure messaging
* Add wallet authentication via WebAuthn or passphrases
* Deploy using Docker or a cloud function

Let me know if you'd like help adding QR code login, Entra integration, or wallet backup/export functionality!
