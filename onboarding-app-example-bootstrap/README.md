# 📖 README - Node.js Onboarding App

## 🚀 Setup & Run the Application

Follow the steps below to **clone, configure, and run** the onboarding app.

### ⚡ Quick Setup (One-Line Commands)

#### 🖥️ Windows (PowerShell) 

```powershell
git clone https://github.com/Cloudstrucc/cs-identity.git; cd .\cs-identity\; cd .\onboarding-app-example-bootstrap\; npm install; New-Item -ItemType File .env; $PRIVATE_KEY=$(openssl rand -hex 32); $ETHERIUM_ADDRESS=$(node genwallet.js | Select-String -Pattern "0x[a-fA-F0-9]+" | Select-Object -First 1 | ForEach-Object { $_.Matches.Value }); echo "ETHEREUM_ADDRESS=$ETHERIUM_ADDRESS" > .env; echo "PRIVATE_KEY=$PRIVATE_KEY" >> .env; cat .env | tr -d '\r' ; dos2unix .env ; node server.js
```

#### 🐧 macOS / Linux (Terminal)

```sh
git clone https://github.com/Cloudstrucc/cs-identity.git && cd ./cs-identity && cd ./onboarding-app-example-bootstrap && npm install && touch .env && ETHERIUM_ADDRESS=$(node genwallet.js | grep -o '0x[a-fA-F0-9]*' | head -1) && echo "ETHEREUM_ADDRESS=$ETHERIUM_ADDRESS" > .env && echo "PRIVATE_KEY=$(openssl rand -hex 32)" >> .env && node server.js
```

### 📥 Clone the Repository

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
