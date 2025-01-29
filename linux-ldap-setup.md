# **🔹 Integrating DID:web with Linux LDAP (OpenLDAP)**

## **📌 Overview**

This guide explains how to **extend an existing OpenLDAP server** to support **DID:web-based authentication**.

✅ **Integrates DID:web as an LDAP attribute**
✅ **Allows organizations to issue DIDs for user authentication**
✅ **LDAP clients (Linux, macOS, Windows) can authenticate using DIDs**

---

## **1️⃣ Prerequisites**

- **OpenLDAP server installed**
- **DID:web JSON document hosted**
- **Configured LDAP schemas and access control policies**

---

## **2️⃣ Step 1: Extend LDAP Schema for DID:web**

1. **Modify the LDAP schema** (`/etc/ldap/schema/did.schema`):
   attributetype ( 1.3.6.1.4.1.4203.1.12 NAME 'didWeb' DESC 'Decentralized Identifier for Web Authentication' EQUALITY caseIgnoreMatch SYNTAX 1.3.6.1.4.1.1466.115.121.1.15 SINGLE-VALUE )
2. **Extend user objects to include the new attribute**.

---

## **3️⃣ Step 2: Configure LDAP Authentication**

1. **Edit `slapd.conf`** to include DID authentication:

access to attrs=didWeb by self write by users read by anonymous auth

2. **Restart OpenLDAP service**:

```bash
systemctl restart slapd

```

## **4️⃣ Step 3: Verify DID Authentication**

#### **Add a test user with a DID:web value**

dn: uid=jdoe,ou=people,dc=example,dc=com
objectClass: inetOrgPerson
uid: jdoe
cn: John Doe
didWeb: did:web:example.com:users:jdoe

#### **Test authentication via LDAP CLI**

ldapsearch -x -LLL -H ldap://localhost -b "dc=example,dc=com" "didWeb=did:web:example.com:users:jdoe"

## **5️⃣ Next Steps**

✅ Integrate **LDAP-based PAM authentication for Linux systems**
✅ Configure **Kerberos integration for single sign-on (SSO)**


---
These **separate Markdown files** will now serve as standalone setup guides for **Azure B2C, Keycloak, OpenAM, and Linux LDAP** identity provider integrations. 🚀 Let me know if you need any refinements! 🎯
---
