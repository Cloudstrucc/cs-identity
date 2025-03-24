# 📖 README - Node.js Onboarding App

## 🚀 Setup & Run the Application

Follow the steps below to **clone, configure, and run** the onboarding app.

### ⚡ Quick Setup (One-Line Commands)

### Pre-requisites

Ensrue that you are usnig Node 18, or 20. **E.G install NVM and use command nvm use 20 before running the npm install**

#### 🖥️ Windows (PowerShell)

This command works only if you are using Node 20

```powershell
git clone https://github.com/Cloudstrucc/cs-identity.git; cd .\cs-identity\; cd .\onboarding-app-example-bootstrap\; npm install; New-Item -ItemType File .env; $PRIVATE_KEY=$(openssl rand -hex 32); $ETHERIUM_ADDRESS=$(node genwallet.js | Select-String -Pattern "0x[a-fA-F0-9]+" | Select-Object -First 1 | ForEach-Object { $_.Matches.Value }); echo "ETHEREUM_ADDRESS=$ETHERIUM_ADDRESS" > .env; echo "PRIVATE_KEY=$PRIVATE_KEY" >> .env; cat .env | tr -d '\r' ; dos2unix .env ; node index.js
```

#### 🐧 macOS / Linux (Terminal)

This command works only if you are using Node 20

```sh
git clone https://github.com/Cloudstrucc/cs-identity.git && cd ./cs-identity && cd ./onboarding-app-example-bootstrap && npm install && touch .env && ETHERIUM_ADDRESS=$(node genwallet.js | grep -o '0x[a-fA-F0-9]*' | head -1) && echo "ETHEREUM_ADDRESS=$ETHERIUM_ADDRESS" > .env && echo "PRIVATE_KEY=$(openssl rand -hex 32)" >> .env && node index.js
```

### 📥 Clone the Repository (follow this step if opting to not use the useful commands above)

```sh
git clone https://github.com/Cloudstrucc/cs-identity.git
```

### 📂 Navigate to the Project Directory

```sh
cd cs-identity
cd onboarding-app-example-bootstrap
```

### 📦 Install Dependencies

```sh
npm install
```

### 🔧 Create and Configure Environment File

1. Create a new `.env` file in the root directory:
   ```sh
   touch .env
   ```
2. Generate a secure private key:
   ```sh
   openssl rand -hex 32
   ```
3. Copy the output of the command and update `.env`:
   ```sh
   PRIVATE_KEY=your_generated_key
   ```

### 🔑 Generate Ethereum Wallet

1. Run the wallet generation script:

   ```sh
   node genwallet.js
   ```
2. Copy the Ethereum address from the output and update `.env`:

   ```sh
   ETHEREUM_ADDRESS=your_generated_ethereum_address
   ```

   *NOTE - In a Windows environment make sure there are no leading or trailing spaces in your .env file otherwise the server.js will not run. You can run the following command in PowerShell to ensure this*

```powershell
cat .env | tr -d '\r'
```

    *NOTE If your `.env` file was saved with Windows-style line endings (`\r\n`), you to convert it to Unix format using the following command in your shell enviornment*

```powershell
dos2unix .env
```

### ▶️ Start the Application

```sh
node server.js OR npm start
```

## 🛠️ Troubleshooting

If you encounter errors such as `MODULE_NOT_FOUND`, follow these steps:

### 🔍 Verify Required Files Exist

Run:

```sh
ls
```

Ensure the following files exist:

* `genwallet.js`
* `server.js`

If missing, try re-cloning the repository:

```sh
git clone https://github.com/Cloudstrucc/cs-identity.git
cd cs-identity
cd onboarding-app-example-bootstrap
```

### 🔧 Manually Create Missing Files

If the files are not in the repository, create them manually:

```powershell
New-Item -ItemType File genwallet.js
New-Item -ItemType File server.js
```

Then, open them and add the necessary content.

### 🔄 Check Node.js Installation

Run:

```sh
node -v
```

Ensure Node.js is correctly installed. If not, reinstall it from [Node.js official site](https://nodejs.org/).

## ✅ Application is now running! 🎉

For any issues, refer to the documentation or raise an issue in the repository.

---

## 🚀 Deploy to Azure App Service (Free Tier)

### 📋 Prerequisites

* An Azure subscription
* Azure CLI installed (or open Azure Cloud Shell via portal.azure.com)
* A ZIP of your built app (e.g. `app.zip`)

---

### 🔢 Deployment Steps for Azure

Pre-requisites, install the Azure CLI SDK on your machine and make sure you can run the az commands from your terminal. You can also use the Azure shell if you have access to it.

1️⃣ **Login & select subscription**

```bash
az login
az account set --subscription "<YOUR_SUBSCRIPTION_NAME_OR_ID>"
```

2️⃣ **Create Resource Group & Free App Service Plan**

```bash
az group create --name myResourceGroup --location eastus
az appservice plan create \
  --name myAppPlan \
  --resource-group myResourceGroup \
  --sku F1 \
  --is-linux
```

3️⃣ **Create the Web App**

*(Choose a globally‑unique name — no spaces)*

```bash
az webapp create \
  --resource-group myResourceGroup \
  --plan myAppPlan \
  --name <YOUR-UNIQUE-APP-NAME> \
  --runtime "NODE|18-lts"
```

4️⃣ **ZIP Deploy your app**

```bash
npm ci --only=production
zip -r app.zip . -x node_modules/\* tests/\*

# if you have issues with npm ci you can zip by excluding node_modules
zip -r app.zip . -x "*.git*" "tests/*"

#This will produce an app.zip file at the root of your project that you will then upload to the azure shell files via the #Manage Files menu on the shell ribbon.
```

You will need to ensure to explicitly tell Azure to build during the deploy (so running npm install). If you keep the node modules in your zip file the zip file is over the limit of 150mb that uploads are allowed directly via the azure shell. If you want to upload files larger with the app including the node_modules, you can do so using azure storage (but not documneted here).

```bash
az webapp config appsettings set   --resource-group CLIENT13   --name vbi-demo-dev   --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

Change into the directory containing your ZIP (e.g. Cloud Shell’s `clouddrive`), then:

```bash
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name <YOUR-UNIQUE-APP-NAME> \
  --src app.zip
```

✅ **Done!** Your app is live at:

```
https://<YOUR-UNIQUE-APP-NAME>.azurewebsites.net
```

## Steps to redeploy

Before deploying to azure, set up your project to only include what is required. Its also recommented that your purge the package-lock.json file

```bash
npm ci --only=production ; zip -r app.zip . -x ".git" "tests/*"
```

Next run the following az command in the azure shell whcih will re-deploy the application:

```bash


az webapp config appsettings set \
  --resource-group CLIENT13 \
  --name vbi-demo-dev \
  --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true &&

az webapp deploy \
  --resource-group CLIENT13 \
  --name vbi-demo-dev \
  --src-path app.zip \
  --type zip &&

az webapp config appsettings set \
  --resource-group CLIENT13 \
  --name vbi-demo-dev \
  --settings FRONTEND_URL="https://vbi-demo-dev.azurewebsites.net"


```

---

### 💡 Notes

* Deployment via ZIP on the **F1 (Free)** tier does **not** rebuild your code.
* If you run into size limits (>150 MB), upload the ZIP to Azure Blob Storage and deploy via its SAS URL instead.
* You can configure an identity provider in the web app in azure so that the app isnt just being accessed anonymously.
