# Integrating Entra Verified ID with the Sidetree protocol involves configuring Sidetree to manage DIDs while enabling interaction with Entra Verified ID for credential issuance and verification. Here's a step-by-step guide

## **1. Understand the Components**

Before you begin, ensure you understand the following:

- **Entra Verified ID** : Microsoft's solution for verifiable credentials and DIDs.
- **Sidetree Protocol** : A scalable, decentralized DID management protocol that operates on existing blockchains (e.g., Bitcoin or Ethereum).

---

## **2. Prerequisites**

1. **Set Up Entra Verified ID**

   - Configure your **Entra Verified ID tenant** in Azure AD.
   - Enable verifiable credential issuance and configure your **VC templates** .
   - Follow the [Microsoft documentation](https://learn.microsoft.com/en-us/azure/active-directory/verifiable-credentials/) to configure templates for your use case.

2. **Set Up Sidetree**

   - Clone the Sidetree GitHub repository:

     ```bash
     git clone https://github.com/decentralized-identity/sidetree.git
     cd sidetree
     ```

   - Install dependencies:

   ```bash
   npm install
   ```

   - Review the [Sidetree documentation](https://github.com/decentralized-identity/sidetree/blob/main/docs/README.md) for additional configuration details.

3. **Blockchain Node** (for Sidetree)

## **Use a Lightweight Bitcoin Node**

### Setting Up Bitcoin Regtest for Simulation

Bitcoin's **regtest** (Regression Test Mode) is a local blockchain environment that is ideal for development and testing. It provides all Bitcoin Core features in a controlled environment without requiring real transactions or mining large blocks.

---

### **1. Install Bitcoin Core**

#### **For Linux (Ubuntu/Debian):**

1. Update and install dependencies:

   ```bash
   sudo apt update
   sudo apt install -y software-properties-common
   ```

2. Add the Bitcoin PPA and install Bitcoin Core

   ```bash
   sudo add-apt-repository -y ppa:bitcoin/bitcoin
   sudo apt update
   sudo apt install -y bitcoind bitcoin-cli
   ```

#### **For macOS:**

1. Install via Homebrew:

   ```bash
   brew install bitcoin
   ```

#### **For Windows:**

1. Download the installer:
   - Visit [Bitcoin Core Download](https://bitcoin.org/en/download).
2. Run the installer and follow the prompts.

---

### **2. Configure Bitcoin Core for Regtest**

1. Create the Bitcoin configuration file:

   - **Linux/macOS:** `~/.bitcoin/bitcoin.conf`
   - **Windows:** `%APPDATA%\Bitcoin\bitcoin.conf`

2. Add the following content to `bitcoin.conf`:

   ```conf
   regtest=1
   server=1
   daemon=1
   rpcuser=bitcoinuser
   rpcpassword=securepassword
   rpcallowip=127.0.0.1
   zmqpubrawblock=tcp://127.0.0.1:28332
   zmqpubrawtx=tcp://127.0.0.1:28333
   ```

   - **`regtest=1`** : Enables regression test mode.
   - **`server=1`** : Allows JSON-RPC calls.
   - **`rpcuser`/`rpcpassword`** : Credentials for RPC communication.
   - **`zmqpubrawblock`/`zmqpubrawtx`** : Enables ZeroMQ for block and transaction notifications (useful for Sidetree).

---

### **3. Start Bitcoin Core in Regtest Mode**

1. Start the Bitcoin daemon:

   ```bash
   bitcoind
   ```

   This starts the Bitcoin node in the background using `regtest` mode.

2. Confirm the node is running:

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword getblockchaininfo
   ```

   Output should indicate `"chain": "regtest"`.

---

### **4. Create and Use a Regtest Wallet**

1. Create a new wallet

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword createwallet "testwallet"
   ```

2. Check your wallet's balance (it will initially be 0):

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword getbalance
   ```

---

### **5. Mine Blocks to Generate Test Bitcoin**

1. Generate 101 blocks to create funds (regtest rewards are immediately spendable after 100 confirmations):

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword generatetoaddress 101 "$(bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword getnewaddress)"
   ```

2. Verify your balance:

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword getbalance
   ```

---

### **6. Interact with the Regtest Blockchain**

1. Create a new address:

  ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword getnewaddress
   ```

2. Send Bitcoin to another address

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword sendtoaddress "<destination_address>" <amount>
   ```

3. Mine more blocks to confirm the transaction:

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword generatetoaddress 1 "$(bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword getnewaddress)"
   ```

4. Check the transaction:

   ```bash
   bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword listtransactions
   ```

---

### **7. Stopping and Restarting the Node**

- Stop the Bitcoin daemon gracefully:

  ```bash
  bitcoin-cli -rpcuser=bitcoinuser -rpcpassword=securepassword stop
  ```

- Restart the node:

  ```bash
  bitcoind
  ```

---

### **8. Connect Sidetree to Bitcoin Regtest**

1. Update the Sidetree configuration to use the Bitcoin Regtest RPC:

   ```json
   {
     "methodName": "sidetree-regtest",
     "blockchainServiceUri": "http://127.0.0.1:8332",
     "rpcUser": "bitcoinuser",
     "rpcPassword": "securepassword"
   }
   ```

2. Restart Sidetree to apply the configuration.

---

### **9. Troubleshooting**

1. Check the Bitcoin daemon logs:

   ```bash
   tail -f ~/.bitcoin/regtest/debug.log
   ```

2. Ensure your RPC credentials match between `bitcoin.conf` and Sidetree's configuration.

---

### **10. Additional Resources**

- [Bitcoin Core Documentation](https://bitcoin.org/en/documentation)
- [Sidetree GitHub Repository](https://github.com/decentralized-identity/sidetree)

## **4. Create a DID Using Sidetree**

1. Use Sidetree to generate a DID:

   - Use the Sidetree client SDK or API to create a DID:

   ```bash
    curl -X POST \
      -H "Content-Type: application/json" \
      -d '{"type": "create", "content": {}}' \
      http://localhost:3000/
   ```

   - This will return a DID that you can store in your application.

2. Resolve the DID using Sidetree:

   ```bash
   curl http://localhost:3000/resolve?did=<your_did>
   ```

---

## **5. Integrate Entra Verified ID with Sidetree**

1. **Modify Your VC Templates**

   - In Entra Verified ID, include the Sidetree DID in your verifiable credential templates as the **subject** of the credential.
   - Example `rules` configuration:

   ```json
   {
     "id": "sidetree-did",
     "type": "DID",
     "pattern": "did:ion:.*"
   }
   ```

2. **Issue a Verifiable Credential**

   - Use Entra Verified ID's API to issue credentials with a Sidetree DID as the subject:

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

   - Use Entra Verified ID's verification API:

     ```http
     POST https://<tenant>.verifiablecredentials.azure.com/v1.0/verify
     Content-Type: application/json

     {
       "credential": "<VC_CONTENT>"
     }
     ```

## **6. Synchronize Credential Status with Sidetree**

1. **Credential Status**

   - Use Sidetree's DID document capabilities to include **credential status** endpoints, enabling revocation or updates to credentials.
   - Update the DID document with a status endpoint:

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

   - Use Sidetree's API to update the DID document:

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
