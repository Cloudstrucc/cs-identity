import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import crypto from 'crypto'
import { IndyVdrModule } from '@aries-framework/indy-vdr'
import { indyVdr } from '@hyperledger/indy-vdr-nodejs'

import {
  Agent,
  InitConfig,
  HttpOutboundTransport,
  DidsModule,
  KeyDidRegistrar,
  KeyDidResolver    
} from '@aries-framework/core'

import { agentDependencies } from '@aries-framework/node'
import { AskarModule } from '@aries-framework/askar'
import { ariesAskar } from '@hyperledger/aries-askar-nodejs'
import { anoncreds } from '@hyperledger/anoncreds-nodejs'
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

  const mockRegistry: AnonCredsRegistry = {
    methodName: 'mock',
    supportedIdentifier: /^did:key:.*/,
    getSchema: async () => { throw new Error('getSchema not implemented') },
    getCredentialDefinition: async () => { throw new Error('getCredentialDefinition not implemented') },
    registerSchema: async () => { throw new Error('registerSchema not implemented') },
    registerCredentialDefinition: async () => { throw new Error('registerCredentialDefinition not implemented') },
    getRevocationRegistryDefinition: async () => { throw new Error('getRevocationRegistryDefinition not implemented') },
    getRevocationStatusList: async () => { throw new Error('getRevocationStatusList not implemented') },
  }

  const newAgent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: {
      askar: new AskarModule({ ariesAskar }),
      anoncreds: new AnonCredsModule({ registries: [mockRegistry] }),
      anoncredsRs: new AnonCredsRsModule({ anoncreds }),
      dids: new DidsModule({
        registrars: [new KeyDidRegistrar()],
        resolvers: [new KeyDidResolver()],
      }),
      
    },
  })

  newAgent.registerOutboundTransport(new HttpOutboundTransport())
  await newAgent.initialize()
  console.log('🎉 Agent initialized')
  agent = newAgent
}

const app = express()
const PORT = 3001

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/did', async (_req, res) => {
  try {
    if (!agent) throw new Error('Agent not initialized')
      
      
      const result = await agent.dids.create({
        method: 'key',
        options: { keyType: 'ed25519' } // all lowercase instead of 'Ed25519'
      })

    console.log('🔍 DID result:', result)

    const did = result.didState?.did
    if (!did) {
      const reason = result.didState?.state === 'failed' ? result.didState.reason : 'Unknown error'
      throw new Error(reason)
    }

    res.json({ did })
  } catch (err: any) {
    console.error('❌ DID creation error:', err)
    res.status(500).json({ error: err.message })
  }
})

app.post('/credential', async (req, res) => {
  try {
    if (!agent) throw new Error('Agent not initialized')
    const credential = req.body
    const stored = { id: 'mock-credential-id' }
    res.json({ credentialId: stored.id })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/health', (_req, res) => {
  res.json({ status: 'Identus wallet agent running.' })
})

app.post('/issue', async (req, res) => {
  try {
    if (!agent) throw new Error('Agent not initialized')

    const { credDefId, subjectDid, values } = req.body

    const credential = {
      id: `urn:uuid:${crypto.randomUUID()}`,
      type: ['VerifiableCredential'],
      issuer: 'did:key:anoncreds-mock',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: subjectDid,
        ...values
      },
      credentialSchema: {
        id: credDefId,
        type: 'AnonCredsSchema'
      }
    }

    res.json({ credential })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

if (process.argv.includes('--cli')) {
  ;(async () => {
    await initializeAgent()
    if (!agent) throw new Error('Agent failed to initialize')
    const { didState } = await agent.dids.create({ method: 'key', options: { keyType: 'Ed25519' } })
    console.log('✅ DID created:', didState.did)
    await agent.shutdown()
  })()
} else {
  initializeAgent().then(() => {
    app.listen(PORT, () => console.log(`🚀 Agent API running at http://localhost:${PORT}`))
  })
}
