
# 📖 README - Node.js Onboarding App

## 🚀 Setup & Run the Application

Follow the steps below to **clone, configure, and run** the onboarding app.

### ⚡ Quick Setup (One-Line Commands)

#### 🖥️ Windows (PowerShell)

```powershell
git clone https://github.com/Cloudstrucc/cs-identity.git; cd .\onboarding-app-example-bootstrap\; npm install; New-Item -ItemType File .env; $PRIVATE_KEY=$(openssl rand -hex 32); echo "PRIVATE_KEY=$PRIVATE_KEY" > .env; node genwallet.js | Tee-Object -Variable ethAddress; echo "ETHERIUM_ADDRESS=$ethAddress" >> .env; node server.js
```

#### 🐧 macOS / Linux (Terminal)

```sh
git clone https://github.com/Cloudstrucc/cs-identity.git && cd ./onboarding-app-example-bootstrap && npm install && touch .env && echo "PRIVATE_KEY=$(openssl rand -hex 32)" > .env && ETHERIUM_ADDRESS=$(node genwallet.js) && echo "ETHERIUM_ADDRESS=$ETHERIUM_ADDRESS" >> .env && node server.js
```

### 📥 Clone the Repository

```sh
git clone https://github.com/Cloudstrucc/cs-identity.git
```

### 📂 Navigate to the Project Directory

```sh
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
   ETHERIUM_ADDRESS=your_generated_ethereum_address
   ```

### ▶️ Start the Application

```sh
node server.js
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
