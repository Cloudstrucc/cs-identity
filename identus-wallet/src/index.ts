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
