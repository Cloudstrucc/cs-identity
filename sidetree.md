# Integrating Entra Verified ID with the Sidetree protocol involves configuring Sidetree to manage DIDs while enabling interaction with Entra Verified ID for credential issuance and verification. Here's a step-by-step guide

## **1. Understand the Components**

Before you begin, ensure you understand the following:

* **Entra Verified ID** : Microsoft's solution for verifiable credentials and DIDs.
* **Sidetree Protocol** : A scalable, decentralized DID management protocol that operates on existing blockchains (e.g., Bitcoin or Ethereum).

---

## **2. Prerequisites**

1. **Set Up Entra Verified ID**

   * Configure your **Entra Verified ID tenant** in Azure AD.
   * Enable verifiable credential issuance and configure your  **VC templates** .
   * Follow the [Microsoft documentation](https://learn.microsoft.com/en-us/azure/active-directory/verifiable-credentials/) to configure templates for your use case.
2. **Set Up Sidetree**

   * Clone the Sidetree GitHub repository:

     ```bash
     git clone https://github.com/decentralized-identity/sidetree.git
     cd sidetree
     ```

   * Install dependencies:

   ```bash
   npm install
   ```

   * Review the [Sidetree documentation](https://github.com/decentralized-identity/sidetree/blob/main/docs/README.md) for additional configuration details.
  
3. **Blockchain Node** (for Sidetree)

## **Use a Lightweight Bitcoin Node**

If you don't have the resources for a full node, you can use Bitcoin Testnet or a third-party service.

1. Bitcoin Testnet:
   Install Bitcoin Core and configure it to use the testnet:

```conf
testnet=1
server=1
txindex=1
rpcuser=<your_rpc_user>
rpcpassword=<your_rpc_password>
zmqpubrawblock=tcp://127.0.0.1:28332
zmqpubrawtx=tcp://127.0.0.1:28333
```

Start Bitcoin Core in testnet mode:

```bash
    bitcoind -testnet -daemon
```

Update Sidetree to use the testnet's blockchain URI.

### Option B: Create Local Blockchain Simulator

Regtest (for Bitcoin)

* Bitcoin Core has a regtest mode for private development.
* Start Bitcoin Core in regtest mode:

```bash
bitcoind -regtest -daemon
```

## **Configure Sidetree**

1. **Update Sidetree Configuration**

   * Navigate to the Sidetree configuration files (e.g., `config.json` in the ION implementation).
   * Specify the DID method you'd like to use. For example, for ION:

     ```json
     {
       "methodName": "ion",
       "blockchainServiceUri": "<YOUR_BLOCKCHAIN_NODE_URI>"
     }
     ```

2. **Run Sidetree**

   * Start the Sidetree service:

     ```bash
     npm start
     ```

## **4. Create a DID Using Sidetree**

1. Use Sidetree to generate a DID:

   * Use the Sidetree client SDK or API to create a DID:

   ```bash
    curl -X POST \
      -H "Content-Type: application/json" \
      -d '{"type": "create", "content": {}}' \
      http://localhost:3000/
   ```

   * This will return a DID that you can store in your application.
2. Resolve the DID using Sidetree:

   ```bash
   curl http://localhost:3000/resolve?did=<your_did>
   ```

---

## **5. Integrate Entra Verified ID with Sidetree**

1. **Modify Your VC Templates**

   * In Entra Verified ID, include the Sidetree DID in your verifiable credential templates as the **subject** of the credential.
   * Example `rules` configuration:

   ```json
    {
      "id": "sidetree-did",
      "type": "DID",
      "pattern": "did:ion:.*"
    }
   ```

2. **Issue a Verifiable Credential**

   * Use Entra Verified ID's API to issue credentials with a Sidetree DID as the subject:

     ```http
     POST https://<tenant>.verifiablecredentials.azure.com/v1.0/issue
     Content-Type: application/json

     {
       "subject": {
         "id": "did:ion:<sidetree_did>",
         "claims": {
           "name": "Alice Doe",
           "age": 30
         }
       },
       "type": ["VerifiableCredential"]
     }
     ```

3. **Verify a Credential**

   * Use Entra Verified ID's verification API:

     ```http
     POST https://<tenant>.verifiablecredentials.azure.com/v1.0/verify
     Content-Type: application/json

     {
       "credential": "<VC_CONTENT>"
     }
     ```

## **6. Synchronize Credential Status with Sidetree**

1. **Credential Status**

   * Use Sidetree's DID document capabilities to include **credential status** endpoints, enabling revocation or updates to credentials.
   * Update the DID document with a status endpoint:

   ```json
    {
      "service": [
        {
          "id": "status",
          "type": "CredentialStatus",
          "serviceEndpoint": "https://example.com/status"
        }
      ]
    }
   ```

2. **Update the DID Document**

   * Use Sidetree's API to update the DID document:

     ```bash
     curl -X POST \
       -H "Content-Type: application/json" \
       -d '{"type": "update", "content": {"service": [...]}}' \
       http://localhost:3000/
     ```

## **7 Testing and Verifying the Node**

Verify Node Status:

```conf
bitcoin-cli -rpcuser=<user> -rpcpassword=<password> getblockchaininfo
```

Anchor Data with Sidetree:

Use Sidetree's API to anchor DID operations on the blockchain:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"type": "anchor", "operation": {...}}' \
  http://localhost:<sidetree_port>/anchor
```
