# 📖 README - Node.js Onboarding App

## 🚀 Setup & Run the Application

Follow the steps below to **clone, configure, and run** the onboarding app.

### ⚡ Quick Setup (One-Line Commands)

#### Pre-requisites

Ensure that you are using Node 18 or 20. **E.g., install NVM and use the command `nvm use 20` before running `npm install`.**

#### 🖥️ Windows (PowerShell)

This command works only if you are using Node 20:

```powershell
# Clone the repository
git clone https://github.com/Cloudstrucc/cs-identity.git

# Navigate to the project directory
cd .\cs-identity\onboarding-app-example-bootstrap

# Install Node.js dependencies
npm install

# Fix permissions for node-gyp cache (optional but recommended for macOS/Linux users)
# For Windows, this is not required

# Create the .env file
New-Item -ItemType File -Name ".env" -Force | Out-Null

# Generate private key
$PRIVATE_KEY = $(openssl rand -hex 32)

# Generate Ethereum address from wallet
$ETHERIUM_ADDRESS = $(node genwallet.js | Select-String -Pattern "0x[a-fA-F0-9]+" | Select-Object -First 1 | ForEach-Object { $_.Matches.Value })

# Write variables to .env file
@"
ETHEREUM_ADDRESS=$ETHERIUM_ADDRESS
PRIVATE_KEY=$PRIVATE_KEY
"@ | Set-Content -NoNewline .env

# Convert file to Unix line endings (only if WSL/gitbash is used; optional in PowerShell)
# dos2unix .env

# Run the app
node index.js

```

#### 🐗 macOS / Linux (Terminal)

```bash
git clone https://github.com/Cloudstrucc/cs-identity.git \
&& cd ./cs-identity/onboarding-app-example-bootstrap \
&& sudo chown -R $(whoami) ~/Library/Caches/node-gyp \
&& npm install \
&& touch .env \
&& ETHERIUM_ADDRESS=$(node genwallet.js | grep -o '0x[a-fA-F0-9]*' | head -1) \
&& echo "ETHEREUM_ADDRESS=$ETHERIUM_ADDRESS" > .env \
&& echo "PRIVATE_KEY=$(openssl rand -hex 32)" >> .env \
&& node index.js
```

---

<div style="position: relative; padding-bottom: 64.86486486486486%; height: 0;"><iframe src="https://www.loom.com/embed/6dbe818420a942e6ace77b72350861c6?sid=86eefb4a-3833-4da5-80ff-82e59c8a52d5" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>

---

## 📥 Manual Setup

### 1. Clone the repository

```bash
git clone https://github.com/Cloudstrucc/cs-identity.git
cd cs-identity/onboarding-app-example-bootstrap
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create and configure .env

```bash
touch .env
openssl rand -hex 32 # Copy the output
```

Add this to `.env`:

```env
PRIVATE_KEY=your_generated_key
```

Generate Ethereum address:

```bash
node genwallet.js
```

Add to `.env`:

```env
ETHEREUM_ADDRESS=your_generated_eth_address
FRONTEND_URL=http://localhost:3000
```

### 4. Run the application

```bash
node server.js
# or
npm start
```

---

## 🚀 Deploy to Heroku (Free Tier)

### 📋 Prerequisites

* A Heroku account
* Heroku CLI installed

### 🔢 Deployment Steps

```bash
heroku login
heroku create your-app-name
git remote add heroku https://git.heroku.com/your-app-name.git

# Deploy

git push heroku main

# Set environment variables
heroku config:set PRIVATE_KEY=your_generated_key
heroku config:set ETHEREUM_ADDRESS=your_generated_ethereum_address
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
```

Visit: `https://your-app-name.herokuapp.com`

---

## 🚀 Deploy to Azure App Service (Free Tier)

### 📋 Prerequisites

* Azure account
* Azure CLI installed
* Node.js 18 or 20

### 🔢 Deployment Steps

```bash
az login
az account set --subscription "<YOUR_SUBSCRIPTION_NAME_OR_ID>"
az group create --name myResourceGroup --location eastus
az appservice plan create --name myAppPlan --resource-group myResourceGroup --sku F1 --is-linux
az webapp create --resource-group myResourceGroup --plan myAppPlan --name <YOUR-UNIQUE-APP-NAME> --runtime "NODE|18-lts"
npm ci --only=production
zip -r app.zip . -x node_modules/* tests/*
az webapp deployment source config-zip --resource-group myResourceGroup --name <YOUR-UNIQUE-APP-NAME> --src app.zip
az webapp config appsettings set --resource-group myResourceGroup --name <YOUR-UNIQUE-APP-NAME> --settings \
PRIVATE_KEY=your_generated_key \
ETHEREUM_ADDRESS=your_generated_ethereum_address \
FRONTEND_URL=https://<YOUR-UNIQUE-APP-NAME>.azurewebsites.net
```

Visit: `https://<YOUR-UNIQUE-APP-NAME>.azurewebsites.net`

---

## 🚀 Deploy to AWS (Free Tier EC2 Ubuntu Server)

### 📋 Prerequisites

* AWS account
* SSH key pair
* EC2 instance (Ubuntu 22.04 LTS)

### 🔢 Steps

```bash
# SSH into EC2
ssh -i key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install nodejs npm git nginx -y

# Clone repo and install
cd /var/www
git clone https://github.com/Cloudstrucc/cs-identity.git
cd cs-identity/onboarding-app-example-bootstrap
npm install

# Setup .env
cat <<EOF > .env
PRIVATE_KEY=...
ETHEREUM_ADDRESS=...
FRONTEND_URL=http://yourdomain.com
EOF
```

### Configure Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/onboarding-app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

### Use PM2

```bash
sudo npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save
```

### 🔐 HTTPS Setup with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run
```

---

## 🚀 Deploy to Linode or DigitalOcean (Cheapest Tiers)

### 📋 Prerequisites

* Account on [Linode](https://www.linode.com) or [DigitalOcean](https://www.digitalocean.com)
* SSH key pair or root password
* Choose the smallest instance (e.g. 1GB RAM, shared CPU, \~\$4-5/mo)

### 🔢 Steps

1. **Create a new Ubuntu 22.04 LTS instance**
2. **SSH into your server**

```bash
ssh root@your-server-ip
```

3. **Install dependencies**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install nodejs npm git nginx -y
```

4. **Clone and set up the app**

```bash
cd /var/www
sudo git clone https://github.com/Cloudstrucc/cs-identity.git
cd cs-identity/onboarding-app-example-bootstrap
npm install
```

5. **Set up environment variables**

```bash
echo "PRIVATE_KEY=your_private_key" > .env
echo "ETHEREUM_ADDRESS=your_eth_address" >> .env
echo "FRONTEND_URL=http://yourdomain.com" >> .env
```

6. **Configure Nginx as reverse proxy** (same config as AWS above)
7. **Install and use PM2**

```bash
sudo npm install -g pm2
pm2 start server.js
pm2 save
pm2 startup
```

8. **(Optional) Setup SSL**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

Visit: `http://yourdomain.com`

---

## ⚙️ GitHub Actions CI/CD

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout repository
      uses: actions/checkout@v3

    - name: Set up Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'

    - name: Install dependencies
      run: npm install

    - name: Build and zip app
      run: |
        npm ci --only=production
        zip -r app.zip . -x "node_modules/*" "tests/*"

    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: <YOUR-UNIQUE-APP-NAME>
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: app.zip
```

Upload your Azure publish profile to:

**Settings → Secrets → Actions → AZURE\_WEBAPP\_PUBLISH\_PROFILE**

---

## Use Ethereal Email (Zero Sign-up Fake SMTP)

Ethereal provides disposable SMTP credentials for testing — no emails are delivered, but you can view them in a browser. It's ideal for realistic dev testing.

### 🔧 Install Nodemailer

```bash
npm install nodemailer
```

### 🛠️ Update Your Transporter Setup

Add this logic where you handle email sending:

```js
const nodemailer = require('nodemailer');

// This creates a test account automatically
nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create test account:', err);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });

  const mailOptions = {
    from: 'DevApp <no-reply@example.com>',
    to: email,
    subject: 'Your Invitation Code',
    html: emailTemplate
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Error sending mail:', err);
      return res.status(500).json({ success: false });
    }

    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    res.json({ success: true });
  });
});
```

### 🔎 View the Email

The console will output a link like:

```text
Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
```

Open that link in your browser to view the email content as it would appear in a real inbox.

---
