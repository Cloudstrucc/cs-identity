# **Integrating Entra Verified ID with `did:web`**

This guide explains how to set up a `did:web` identity and integrate it with **Microsoft Entra Verified ID** for credential issuance and verification.

---

## **1. Understand the Components**

Before you begin, ensure you understand the following:

* **Entra Verified ID** : Microsoft's solution for decentralized identity and verifiable credentials.
* **DIDKit** : A lightweight toolkit to create and manage `did:web`.
* **`did:web`** : A decentralized identifier stored on a web server, allowing organizations to establish trusted digital identities  **without using a blockchain** .

---

## **2. Prerequisites**

1. **Set Up Entra Verified ID**
   * Configure your **Entra Verified ID tenant** in  **Azure AD** .
   * Enable **Verifiable Credential issuance** and configure your  **VC templates** .
   * Follow [Microsoft’s documentation](https://learn.microsoft.com/en-us/azure/active-directory/verifiable-credentials/) to set up credentials.
2. **Install DIDKit to Create `did:web`**
   * **For Node.js:**
     ```bash
     npm install -g didkit-cli
     ```
   * **For Rust (alternative option):**
     ```bash
     cargo install didkit
     ```

---

## **3. Create a `did:web` Identifier**

### **Step 1: Generate a `did:web` DID**

Run the following command to generate a `did:web` identifier:

```bash
didkit generate-did web https://example.com
```

Example Output:

```json
{
  "id": "did:web:example.com",
  "verificationMethod": [
    {
      "id": "did:web:example.com#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:web:example.com",
      "publicKeyJwk": { "kty": "EC", "crv": "P-256", "x": "YOUR_PUBLIC_KEY_X", "y": "YOUR_PUBLIC_KEY_Y" }
    }
  ],
  "authentication": ["did:web:example.com#key-1"],
  "assertionMethod": ["did:web:example.com#key-1"]
}
```

### **Step 2: Save and Host the `did.json` File**

* Save the output as a file named `did.json`.
* Upload it to:
  ```
  https://example.com/.well-known/did.json
  ```
* Verify that it loads correctly in a browser:
  ```
  https://example.com/.well-known/did.json
  ```

---

## **4. Set Up Entra Verified ID for `did:web`**

To issue verifiable credentials (VCs) using Microsoft  **Entra Verified ID** , follow these steps.

### **Step 1: Enable Microsoft Entra Verified ID**

1. Sign in to the  **Azure Portal** :

   🔗 [https://portal.azure.com](https://portal.azure.com)
2. Search for  **Microsoft Entra ID** .
3. Navigate to **Identity** >  **Verified ID** .
4. Click **Enable Verified ID** (if not already enabled).

---

### **Step 2: Create a New Verifiable Credentials Issuer**

1. In  **Microsoft Entra Verified ID** , go to  **Verifiable Credentials** .
2. Click **Issuers** →  **+ Create Issuer** .
3. Choose **`did:web`** as the DID method.
4. Enter your `did:web` identifier:
   ```
   did:web:example.com
   ```
5. Upload your  **DID document (`did.json`)** .

---

### **Step 3: Configure Credential Templates**

Credential templates define the types of **Verifiable Credentials** (VCs) that your organization can issue.

1. Navigate to **Microsoft Entra Verified ID** →  **Verifiable Credentials** .
2. Click **Credential Templates** →  **+ New Credential Template** .
3. Enter the following details:
   * **Credential Type** : `ExampleCredential`
   * **Issuer** : `did:web:example.com`
   * **Claims** (e.g., `name`, `email`, `role`).
   * **Expiration** : Configure an optional expiration period.
4. Click  **Save** .

---

### **Step 4: Configure the Issuance API**

1. Open **Microsoft Entra Verified ID** → **Verifiable Credentials** →  **API Permissions** .
2. Enable the following:
   * `vc_issuer`
   * `vc_verifier`
3. Generate an **API Key** and store it securely.

---

## **5. Issue and Verify Verifiable Credentials**

### **Issue a Verifiable Credential**

Use `didkit` to issue a **Verifiable Credential** with your `did:web` identifier.

```bash
didkit issue-credential \
  --holder did:web:example.com \
  --credential '{
    "@context":["https://www.w3.org/2018/credentials/v1"],
    "type":["VerifiableCredential"],
    "issuer":"did:web:example.com",
    "credentialSubject": {
      "id": "did:web:example.com",
      "name": "Alice Doe",
      "role": "Pilot"
    }
  }' \
  --private-key key.json
```

---

### **Verify a Verifiable Credential**

Use `didkit` to verify a  **Verifiable Credential** .

```bash
didkit verify-credential --credential credential.json
```

---

## **6. Resolve and Use `did:web`**

### **Test DID Resolution**

1. Use a DID resolver:
   ```bash
   curl https://resolver.example.com/1.0/identifiers/did:web:example.com
   ```
2. Verify your DID document:
   ```bash
   curl https://example.com/.well-known/did.json
   ```

---

## **7. Troubleshooting**

### **Common Issues**

| Issue                               | Solution                                 |
| ----------------------------------- | ---------------------------------------- |
| `did.json`not found               | Ensure it's in `.well-known/`directory |
| Entra Verified ID cannot verify DID | Ensure HTTPS and correct JSON format     |
| Public key errors                   | Use a valid EC P-256 key                 |

---

## **8. Additional Resources**

* [W3C DID Specification](https://www.w3.org/TR/did-core/)
* [Microsoft Entra Verified ID Docs](https://learn.microsoft.com/en-us/azure/active-directory/verifiable-credentials/)
* [did:web Resolver](https://did-web.web.app/)
* [DIDKit GitHub](https://github.com/spruceid/didkit)
