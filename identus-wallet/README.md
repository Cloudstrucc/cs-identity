## Identus DID Wallet - Setup Guide (REST API + CLI + UI)

This guide helps you set up a Hyperledger Aries Framework JavaScript (AFJ) based DID wallet agent using the Identus stack, complete with a REST API and simple frontend UI.

---

## 🚀 Features

- Create DIDs via API or CLI
- Store mock credentials (expandable to real anoncreds support)
- View DID via simple web UI
- Ready for full anoncreds, wallet import/export, and messaging

---

## ✅ Final Working Package Versions

```json
"@aries-framework/core": "^0.4.2",
"@aries-framework/node": "^0.4.2",
"@aries-framework/askar": "^0.4.2",
"@aries-framework/anoncreds": "^0.4.2",
"@aries-framework/anoncreds-rs": "^0.4.2",
"@hyperledger/anoncreds-nodejs": "^0.3.1",
"@hyperledger/aries-askar-nodejs": "^0.2.3"
```

### 🔧 Required Overrides in `package.json`

```json
"overrides": {
  "@hyperledger/anoncreds-shared": "0.3.1",
  "@hyperledger/aries-askar-shared": "0.2.3"
}
```

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
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import {
  Agent,
  InitConfig,
  HttpOutboundTransport,
} from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import { AskarModule } from '@aries-framework/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'

// import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import {
  AnonCredsModule,
  AnonCredsRegistry,
} from '@aries-framework/anoncreds'
import { AnonCredsRsModule } from '@aries-framework/anoncreds-rs'



let agent: Agent | undefined

const initializeAgent = async () => {
  const config: InitConfig = {
    label: 'Identus DID Wallet',
    walletConfig: {
      id: 'wallet-id',
      key: 'very-secure-password',
    },
    endpoints: ['http://localhost:3001'],
  }

  // ✅ Dummy registry that satisfies all required methods
  const mockRegistry: AnonCredsRegistry = {
    methodName: 'mock',
    supportedIdentifier: /^did:key:.*/,
    getSchema: async () => {
      throw new Error('getSchema not implemented')
    },
    getCredentialDefinition: async () => {
      throw new Error('getCredentialDefinition not implemented')
    },
    registerSchema: async () => {
      throw new Error('registerSchema not implemented')
    },
    registerCredentialDefinition: async () => {
      throw new Error('registerCredentialDefinition not implemented')
    },
    getRevocationRegistryDefinition: async () => {
      throw new Error('getRevocationRegistryDefinition not implemented')
    },
    getRevocationStatusList: async () => {
      throw new Error('getRevocationStatusList not implemented')
    },
  }
  
  const newAgent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ ariesAskar }), // from @hyperledger/aries-askar-shared
      anoncreds: new AnonCredsModule({
        registries: [mockRegistry],
      }),
      anoncredsRs: new AnonCredsRsModule({
        anoncreds, // from @hyperledger/anoncreds-nodejs
      }),
    },   
  })
  

  newAgent.registerOutboundTransport(new HttpOutboundTransport())
  await newAgent.initialize()
  console.log('🎉 Agent initialized')
  agent = newAgent
}

// ---------------- Express Setup ----------------

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/did', async (_req, res) => {
  try {
    if (!agent) throw new Error('Agent not initialized')
    const { didState } = await agent.dids.create({ method: 'key' })
    res.json({ did: didState.did })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/credential', async (req, res) => {
  try {
    if (!agent) throw new Error('Agent not initialized')
    const credential = req.body
    // Placeholder — replace with real anoncreds logic later
    const stored = { id: 'mock-credential-id' }
    res.json({ credentialId: stored.id })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/health', (_req, res) => {
  res.json({ status: 'Identus wallet agent running.' })
})

// ---------------- CLI Mode ----------------

if (process.argv.includes('--cli')) {
  ;(async () => {
    await initializeAgent()
    if (!agent) throw new Error('Agent failed to initialize')
    const { didState } = await agent.dids.create({ method: 'key' })
    console.log('✅ DID created:', didState.did)
    await agent.shutdown()
  })()
} else {
  initializeAgent().then(() => {
    app.listen(PORT, () =>
      console.log(`🚀 Agent API running at http://localhost:${PORT}`)
    )
  })
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

## 🌐 Simple Frontend UI: `public/index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Identus Wallet UI</title>
</head>
<body>
  <h1>🪪 Identus DID Wallet</h1>
  <button onclick="createDID()">Create New DID</button>
  <pre id="output"></pre>

  <script>
    async function createDID() {
      const res = await fetch('/did')
      const data = await res.json()
      document.getElementById('output').textContent = JSON.stringify(data, null, 2)
    }
  </script>
</body>
</html>
```

---

## 🔄 Run It

### Dev mode:

```bash
npm run dev
```

- Agent available at `http://localhost:3001`
- UI available at `http://localhost:3001/index.html`

## ✅ Next Steps

* Add credential issuance workflow
* Integrate DIDComm for secure messaging
* Add wallet authentication via WebAuthn or passphrases
* Deploy using Docker or a cloud function

Let me know if you'd like help adding QR code login, Entra integration, or wallet backup/export functionality!
