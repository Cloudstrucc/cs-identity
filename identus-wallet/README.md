
# Identus DID Wallet - Setup Guide (REST API + CLI + UI)

This guide will help you set up a Hyperledger Identus (AFJ) DID wallet project with a REST API, CLI interface, and frontend UI integration.

---

## 🧩 Features

* REST API to create DIDs and store Verifiable Credentials (VCs)
* CLI mode for direct terminal use
* Frontend UI to interact with the wallet in the browser

---

## ⚙️ Setup Prerequisites

Before installing, ensure the following dependencies are present on your system:

### ✅ Recommended Environment

* **Node.js** v18.x or later (using `nvm` is recommended)
* **npm** (Node Package Manager)
* **Python** 3.11.x with `distutils` (required for native modules)

> ⚠️ Note: Python 3.13+ is not recommended due to removal of `distutils`, which breaks native dependency compilation.

### Install Python 3.11 (macOS example):

```bash
brew install python@3.11
```

### Set Python version for Node-Gyp

```bash
export PYTHON=$(which python3.11)
```

You can add this to your shell config (`~/.zshrc`, `~/.bashrc`, etc.):

```bash
echo 'export PYTHON=$(which python3.11)' >> ~/.zshrc
source ~/.zshrc
```

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
npm install express cors body-parser \
@aries-framework/core \
@aries-framework/node \
@aries-framework/anoncreds \
@aries-framework/askar \
typescript ts-node-dev --save
npm install --save-dev @types/cors
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

### 4. Create `src/index.ts`

```ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Agent, InitConfig } from '@aries-framework/core';
import { agentDependencies } from '@aries-framework/node';
import { HttpOutboundTransport } from '@aries-framework/core';
import { AskarModule } from '@aries-framework/askar';
import { AnonCredsModule, AnonCredsModuleConfigOptions } from '@aries-framework/anoncreds';
import { IndyVdrAnonCredsRegistry } from '@aries-framework/anoncreds';

let agent: Agent;

const initializeAgent = async () => {
  const config: InitConfig = {
    label: 'DID Wallet Agent',
    walletConfig: {
      id: 'user-wallet',
      key: 'super-secure-password',
    },
    endpoints: ['http://localhost:3001'],
  };

  const anonCredsConfig: AnonCredsModuleConfigOptions = {
    registries: [new IndyVdrAnonCredsRegistry()],
  };

  const newAgent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule(),
      anoncreds: new AnonCredsModule(anonCredsConfig),
    },
  });

  newAgent.registerOutboundTransport(new HttpOutboundTransport());
  await newAgent.initialize();
  console.log('🎉 Agent initialized');

  agent = newAgent;
};

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/did', async (req, res) => {
  try {
    const { didState } = await agent.dids.create({ method: 'key' });
    res.json({ did: didState.did });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/credential', async (req, res) => {
  try {
    const credential = req.body;
    // Simulate storage for demo purpose, replace with actual AnonCreds method when ready
    const stored = { id: 'mock-credential-id' };
    res.json({ credentialId: stored.id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'DID wallet agent running.' });
});

if (process.argv.includes('--cli')) {
  (async () => {
    await initializeAgent();
    const { didState } = await agent.dids.create({ method: 'key' });
    console.log('✅ New DID:', didState.did);
    await agent.shutdown?.();
  })();
} else {
  initializeAgent().then(() => {
    app.listen(PORT, () => console.log(`🚀 API running at http://localhost:${PORT}`));
  });
}
```

### 5. Start the Agent API Server

```bash
npm run dev
```

* Server runs at: `http://localhost:3001`
* Endpoints:
  * `GET /did` → Creates a new DID
  * `POST /credential` → Stores a credential
  * `GET /health` → Status check

### 6. Run in CLI Mode

```bash
npm run cli
```

* Creates a DID and prints it to terminal.

---

## 🖥️ Frontend UI: `public/index.html`

(Create this file in the `public/` folder)

[...]

---

## ✅ Next Steps

* Add credential issuance workflow
* Integrate DIDComm for secure messaging
* Add wallet authentication via WebAuthn or passphrases
* Deploy using Docker or a cloud function

Let me know if you'd like help adding QR code login, Entra integration, or wallet backup/export functionality!
