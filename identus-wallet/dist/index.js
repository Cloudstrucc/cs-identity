"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = __importDefault(require("crypto"));
const core_1 = require("@aries-framework/core");
const node_1 = require("@aries-framework/node");
const askar_1 = require("@aries-framework/askar");
const aries_askar_nodejs_1 = require("@hyperledger/aries-askar-nodejs");
const anoncreds_nodejs_1 = require("@hyperledger/anoncreds-nodejs");
const anoncreds_1 = require("@aries-framework/anoncreds");
const anoncreds_rs_1 = require("@aries-framework/anoncreds-rs");
let agent;
const initializeAgent = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        label: 'Identus DID Wallet',
        walletConfig: {
            id: 'wallet-id',
            key: 'very-secure-password',
        },
        endpoints: ['http://localhost:3001'],
    };
    const mockRegistry = {
        methodName: 'mock',
        supportedIdentifier: /^did:key:.*/,
        getSchema: () => __awaiter(void 0, void 0, void 0, function* () { throw new Error('getSchema not implemented'); }),
        getCredentialDefinition: () => __awaiter(void 0, void 0, void 0, function* () { throw new Error('getCredentialDefinition not implemented'); }),
        registerSchema: () => __awaiter(void 0, void 0, void 0, function* () { throw new Error('registerSchema not implemented'); }),
        registerCredentialDefinition: () => __awaiter(void 0, void 0, void 0, function* () { throw new Error('registerCredentialDefinition not implemented'); }),
        getRevocationRegistryDefinition: () => __awaiter(void 0, void 0, void 0, function* () { throw new Error('getRevocationRegistryDefinition not implemented'); }),
        getRevocationStatusList: () => __awaiter(void 0, void 0, void 0, function* () { throw new Error('getRevocationStatusList not implemented'); }),
    };
    const newAgent = new core_1.Agent({
        config,
        dependencies: node_1.agentDependencies,
        modules: {
            askar: new askar_1.AskarModule({ ariesAskar: aries_askar_nodejs_1.ariesAskar }),
            anoncreds: new anoncreds_1.AnonCredsModule({ registries: [mockRegistry] }),
            anoncredsRs: new anoncreds_rs_1.AnonCredsRsModule({ anoncreds: anoncreds_nodejs_1.anoncreds }),
            dids: new core_1.DidsModule({
                registrars: [new core_1.KeyDidRegistrar()],
                resolvers: [new core_1.KeyDidResolver()],
            }),
        },
    });
    newAgent.registerOutboundTransport(new core_1.HttpOutboundTransport());
    yield newAgent.initialize();
    console.log('🎉 Agent initialized');
    agent = newAgent;
});
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
app.get('/did', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (!agent)
            throw new Error('Agent not initialized');
        const result = yield agent.dids.create({
            method: 'key',
            options: { keyType: 'ed25519' } // all lowercase instead of 'Ed25519'
        });
        console.log('🔍 DID result:', result);
        const did = (_a = result.didState) === null || _a === void 0 ? void 0 : _a.did;
        if (!did) {
            const reason = ((_b = result.didState) === null || _b === void 0 ? void 0 : _b.state) === 'failed' ? result.didState.reason : 'Unknown error';
            throw new Error(reason);
        }
        res.json({ did });
    }
    catch (err) {
        console.error('❌ DID creation error:', err);
        res.status(500).json({ error: err.message });
    }
}));
app.post('/credential', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!agent)
            throw new Error('Agent not initialized');
        const credential = req.body;
        const stored = { id: 'mock-credential-id' };
        res.json({ credentialId: stored.id });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
app.get('/health', (_req, res) => {
    res.json({ status: 'Identus wallet agent running.' });
});
app.post('/issue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!agent)
            throw new Error('Agent not initialized');
        const { credDefId, subjectDid, values } = req.body;
        const credential = {
            id: `urn:uuid:${crypto_1.default.randomUUID()}`,
            type: ['VerifiableCredential'],
            issuer: 'did:key:anoncreds-mock',
            issuanceDate: new Date().toISOString(),
            credentialSubject: Object.assign({ id: subjectDid }, values),
            credentialSchema: {
                id: credDefId,
                type: 'AnonCredsSchema'
            }
        };
        res.json({ credential });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}));
if (process.argv.includes('--cli')) {
    ;
    (() => __awaiter(void 0, void 0, void 0, function* () {
        yield initializeAgent();
        if (!agent)
            throw new Error('Agent failed to initialize');
        const { didState } = yield agent.dids.create({ method: 'key', options: { keyType: 'Ed25519' } });
        console.log('✅ DID created:', didState.did);
        yield agent.shutdown();
    }))();
}
else {
    initializeAgent().then(() => {
        app.listen(PORT, () => console.log(`🚀 Agent API running at http://localhost:${PORT}`));
    });
}
