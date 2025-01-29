# **🔹 Integrating DID:web with OpenAM**

## **📌 Overview**

This guide explains how to configure **OpenAM** to support **DID:web authentication and verifiable credentials issuance**.

✅ **Supports OIDC, SAML, and custom IDP configurations**
✅ **Extensible for enterprise federated identity**
✅ **Role-based access using DID:web claims**

---

## **1️⃣ Prerequisites**

- **ForgeRock OpenAM installed**
- **DID:web hosted with public access**
- **OIDC and SAML configured in OpenAM**

---

## **2️⃣ Step 1: Configure an OIDC Provider**

1. **Login to OpenAM Admin Console** → Go to **Authentication**
2. **Create a new OIDC Identity Provider**
3. **Set the Provider URL** to your DID:web resolver: https://yourdomain.com/.well-known/did.json
4. **Enable DID Authentication** under `Advanced Settings`.

---

## **3️⃣ Step 2: Define Role-Based Access**

1. **Go to "Policy Sets"** and create new rules
2. **Assign user roles based on DID:web claims**
3. **Enable multi-factor authentication (MFA)**

- Add **DID:web + WebAuthn** for authentication.

---

## **4️⃣ Step 3: Test Authentication**

1. **Try signing in using a DID:web credential.**
2. **Verify that OpenAM correctly maps the identity to roles.**

---

## **5️⃣ Next Steps**

✅ Enable **OAuth2 Resource Server** for protected API access
✅ Integrate with **LDAP directories** for extended authentication
