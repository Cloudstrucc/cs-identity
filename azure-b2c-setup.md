# **🔹 Integrating DID:web with Azure B2C**

## **📌 Overview**

This guide explains how to integrate **DID:web authentication and verifiable credentials issuance** with **Azure B2C**.

✅ **Users can authenticate using DID:web**
✅ **Azure B2C acts as an OIDC provider for verifiable credentials**
✅ **Supports self-service identity verification**

---

## **1️⃣ Prerequisites**

- **Azure Subscription** with **B2C tenant** set up
- **Node.js backend with DID:web support**
- **Domain configured for DID:web hosting**

---

## **2️⃣ Step 1: Configure Azure B2C**

### **🔹 Create a User Flow for Authentication**

1. **Go to Azure B2C Portal** → User Flows
2. **Click "New user flow"** → Choose **Sign-up and Sign-in (Recommended)**
3. **Add Identity Providers** → Ensure **OIDC and Custom Policies** are enabled.
4. **Enable Claims for DID:web Authentication**:
   - **Select "Collect Information"**
   - Add **"customClaim"** for the DID:web identity.

---

## **3️⃣ Step 2: Enable DID:web Authentication**

1. **Go to Identity Providers** → **Add OIDC Provider**
2. **Enter the DID:web Issuer URL**: https://yourdomain.com/.well-known/did.json
3. **Set the "Issuer URL"** to match the DID resolver for your organization.

---

## **4️⃣ Step 3: Test DID Authentication**

1. **Go to the B2C sign-in page**.
2. **Authenticate using DID:web credentials** from your wallet.
3. **Azure B2C verifies the credential** and logs in the user.

---

## **5️⃣ Next Steps**

✅ Integrate **DID:web with Azure API Management**
✅ Use **Entra External ID for extended federation**
