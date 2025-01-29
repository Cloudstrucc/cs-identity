# **🚀 Deploying the Facial Recognition & DID Issuance App to Azure & AWS (Cost-Effective Solutions)**

This guide will show you how to deploy the **Node.js Facial Recognition & DID Issuance App** to **Azure** and **AWS** using the  **cheapest options** , while also integrating **OIDC authentication** via  **Entra External ID, Keycloak, and Azure B2C** .

---

## **📌 Next Steps: Deployment & OIDC Integration**

| Step                                              | Description                                                                  |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| **1️⃣ Deploy to Azure (Cheapest Option)** | Host the app using**Azure App Service (Free Tier)**                    |
| **2️⃣ Deploy to AWS (Cheapest Option)**   | Use**AWS Elastic Beanstalk (Free Tier) or AWS Lightsail**              |
| **3️⃣ Set Up OIDC Authentication**        | Allow users to log in via**Entra External ID, Keycloak, or Azure B2C** |
| **4️⃣ Test & Secure the Deployment**      | Ensure security with HTTPS & configure authentication flows                  |

---

## **1️⃣ Deploying to Azure (Cheapest Way)**

Azure App Service (Free Tier) is the most **cost-effective option** for deploying the app.

### **Step 1: Install Azure CLI**

```bash
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash
az login
```

### **Step 2: Create an Azure Web App**

```bash
az webapp up --resource-group MyResourceGroup --name my-did-app --runtime "NODE|18-lts"
```

### **Step 3: Deploy the App**

1. **Initialize Git (if not already)**
   ```bash
   git init
   git add .
   git commit -m "Deploying to Azure"
   ```
2. **Deploy using Git**
   ```bash
   az webapp deployment source config-local-git --name my-did-app --resource-group MyResourceGroup
   ```
3. **Push the code to Azure**
   ```bash
   git remote add azure <DEPLOYMENT-URL>
   git push azure main
   ```

### **Step 4: Configure Environment Variables**

Set environment variables in  **Azure App Service** :

```bash
az webapp config appsettings set --resource-group MyResourceGroup --name my-did-app --settings AWS_ACCESS_KEY_ID=<your-access-key> AWS_SECRET_ACCESS_KEY=<your-secret-key>
```

---

## **2️⃣ Deploying to AWS (Cheapest Way)**

### **Option 1: AWS Elastic Beanstalk (Free Tier)**

1. **Install AWS CLI**
   ```bash
   sudo apt install awscli -y
   aws configure
   ```
2. **Initialize and Deploy**
   ```bash
   eb init -p node.js my-did-app
   eb create my-did-app-env
   ```

### **Option 2: AWS Lightsail (Cheapest VM Option)**

1. **Create a Lightsail instance**
   * Go to **AWS Lightsail Console** →  **Create Instance** .
   * Select  **Ubuntu 20.04 LTS** .
   * Choose  **$3.50/month plan** .
2. **SSH into the instance**
   ```bash
   ssh -i my-key.pem ubuntu@my-lightsail-ip
   ```
3. **Deploy the app**
   ```bash
   sudo apt update
   sudo apt install nodejs npm
   git clone https://github.com/my-repo.git
   cd my-repo
   npm install
   node server.js
   ```

---

## **3️⃣ Integrating OIDC Authentication (Azure B2C, Keycloak, Entra External ID)**

Now, we **integrate authentication using OpenID Connect (OIDC)** so that users can sign in via  **Azure B2C, Keycloak, or Entra External ID** .

### **Step 1: Install OIDC Library**

```bash
npm install passport passport-openidconnect express-session
```

### **Step 2: Configure OIDC for Different Providers**

#### **🔹 Entra External ID (OIDC)**

1. **Register the App in Entra External ID**
   * Go to **Microsoft Entra Admin Center** → **External Identities** →  **App Registrations** .
   * Set redirect URI: `https://my-did-app.com/auth/callback`
   * **Copy Client ID & Tenant ID** .
2. **Configure the OIDC Middleware in `server.js`**
   ```javascript
   const passport = require("passport");
   const OpenIDConnectStrategy = require("passport-openidconnect");

   passport.use(
       new OpenIDConnectStrategy(
           {
               issuer: "https://login.microsoftonline.com/<YOUR_TENANT_ID>/v2.0",
               authorizationURL: "https://login.microsoftonline.com/<YOUR_TENANT_ID>/oauth2/v2.0/authorize",
               tokenURL: "https://login.microsoftonline.com/<YOUR_TENANT_ID>/oauth2/v2.0/token",
               clientID: process.env.CLIENT_ID,
               clientSecret: process.env.CLIENT_SECRET,
               callbackURL: "https://my-did-app.com/auth/callback",
               scope: ["openid", "profile", "email"],
           },
           function (issuer, sub, profile, accessToken, refreshToken, done) {
               return done(null, profile);
           }
       )
   );

   app.use(passport.initialize());
   app.get("/auth", passport.authenticate("openidconnect"));
   app.get("/auth/callback", passport.authenticate("openidconnect", { failureRedirect: "/" }), (req, res) => {
       res.redirect("/dashboard");
   });
   ```

#### **🔹 Keycloak (OIDC)**

1. **Register a Client in Keycloak**
   * Go to **Keycloak Admin Console** → **Clients** →  **Create Client** .
   * Set redirect URI: `https://my-did-app.com/auth/callback`
   * Copy  **Client ID & Secret** .
2. **Update `server.js`**
   ```javascript
   passport.use(
       new OpenIDConnectStrategy(
           {
               issuer: "https://keycloak.example.com/auth/realms/myrealm",
               authorizationURL: "https://keycloak.example.com/auth/realms/myrealm/protocol/openid-connect/auth",
               tokenURL: "https://keycloak.example.com/auth/realms/myrealm/protocol/openid-connect/token",
               clientID: process.env.CLIENT_ID,
               clientSecret: process.env.CLIENT_SECRET,
               callbackURL: "https://my-did-app.com/auth/callback",
               scope: ["openid", "profile", "email"],
           },
           function (issuer, sub, profile, accessToken, refreshToken, done) {
               return done(null, profile);
           }
       )
   );
   ```

#### **🔹 Azure B2C (OIDC)**

1. **Create a User Flow in Azure B2C**
   * Go to **Azure Portal** → **Azure AD B2C** → **User Flows** →  **New User Flow** .
   * Select  **Sign in with OIDC** .
2. **Update `server.js`**
   ```javascript
   passport.use(
       new OpenIDConnectStrategy(
           {
               issuer: "https://myb2c.b2clogin.com/tfp/<TENANT>.onmicrosoft.com/B2C_1A_signup_signin/v2.0",
               authorizationURL: "https://myb2c.b2clogin.com/<TENANT>.onmicrosoft.com/oauth2/v2.0/authorize",
               tokenURL: "https://myb2c.b2clogin.com/<TENANT>.onmicrosoft.com/oauth2/v2.0/token",
               clientID: process.env.CLIENT_ID,
               clientSecret: process.env.CLIENT_SECRET,
               callbackURL: "https://my-did-app.com/auth/callback",
               scope: ["openid", "profile", "email"],
           },
           function (issuer, sub, profile, accessToken, refreshToken, done) {
               return done(null, profile);
           }
       )
   );
   ```

---

## **🚀 Final Steps**

✅ **Deploy the App** on **Azure or AWS**

✅ **Enable OIDC Authentication** via **Azure B2C, Keycloak, or Entra External ID**

✅ **Issue DIDs to authenticated users**

✅ **Test the entire flow** with sample users
