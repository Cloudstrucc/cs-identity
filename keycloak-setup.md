# **🔹 Integrating DID:web with Keycloak**

## **📌 Overview**

This guide explains how to integrate **Keycloak** with **DID:web** for authentication.

✅ **Supports OIDC and SAML authentication**
✅ **Self-hosted identity provider**
✅ **Custom claims for verifiable credentials issuance**

---

## **1️⃣ Prerequisites**

- **Keycloak 18+ installed**
- **DID:web JSON document hosted**
- **OIDC client configured in Keycloak**

---

## **2️⃣ Step 1: Configure Keycloak Realm**

1. **Login to Keycloak Admin Console**
2. **Go to "Identity Providers" → Add OIDC Provider**
3. **Enter the DID:web Issuer URL**: https://yourdomain.com/.well-known/did.json
4. **Set "Token Mapping"**:

- Add claim **"did:web"**
- Map to **"preferred_username"** in Keycloak

---

## **3️⃣ Step 2: Configure DID:web Authentication**

1. **Go to "Clients" → Create New OIDC Client**
2. **Set Redirect URL** to your application
3. **Enable JWT Token Exchange**
4. **Set Up Keycloak User Federation**:

- Import **DID:web credentials** into Keycloak identity store.

---

## **4️⃣ Step 3: Verify and Test Authentication**

1. **Try signing in using DID:web credentials**.
2. **Verify claims mapping and role-based access**.

---

## **5️⃣ Next Steps**

✅ Use **Keycloak's SAML integration** for federated login
✅ Deploy **Keycloak as a containerized service (Docker/Kubernetes)**
