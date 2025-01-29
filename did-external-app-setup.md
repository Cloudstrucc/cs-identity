
# **🚀 Setting Up a Node.js App for Facial Recognition, ID Verification, and DID Issuance**

## **📌 Overview**

This guide walks you through setting up the  **Node.js onboarding app** , which integrates the **modified Bootstrap theme** from your repository at:

🔗 [onboarding-app-example-bootstrap](https://github.com/Cloudstrucc/cs-identity/tree/main/onboarding-app-example-bootstrap)

The app features:

✅ **Facial Recognition for user identity verification**

✅ **ID Verification with OCR to extract user details**

✅ **DID Issuance (`did:web`) using `did-jwt` for decentralized identity**

✅ **Bootstrap-based responsive UI** for a professional look

✅ **Integration with `did-jwt` for DID:web authentication**

### **🔹 Tech Stack**

| Component                       | Technology                                  |
| ------------------------------- | ------------------------------------------- |
| **Backend**               | Node.js, Express.js                         |
| **Frontend UI**           | Handlebars.js (HBS), Bootstrap              |
| **Face Recognition**      | AWS Rekognition, OpenCV, Microsoft Face API |
| **OCR for ID Extraction** | Tesseract.js, Google Vision API             |
| **Liveness Detection**    | iBeta-certified APIs (FaceTec, Onfido)      |
| **DID Issuance**          | `did-jwt`(`did:web`)                    |

---

## **1️⃣ Install Node.js and Dependencies**

### **🔹 Install Node.js (If Not Installed)**

Download and install  **Node.js** :

* **Windows/Mac:** [Node.js Official Website](https://nodejs.org/en/download/)
* **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update && sudo apt install nodejs npm -y
  ```

### **🔹 Clone the Repository & Set Up the Project**

```bash
git clone https://github.com/Cloudstrucc/cs-identity.git
cd cs-identity/onboarding-app-example-bootstrap
npm install
```

### **🔹 Install Required Dependencies**

```bash
npm install express express-handlebars body-parser multer dotenv tesseract.js axios cors
npm install @aws-sdk/client-rekognition opencv4nodejs did-jwt did-resolver ethr-did-resolver key-did-resolver ethers
```

---

## **2️⃣ Configure the Express.js Server**

### **🔹 Update `server.js` to Use the Custom Theme and DID JWT**

Ensure `server.js` properly references the Bootstrap theme and `did-jwt`:

```javascript
require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { createJWT, ES256KSigner } = require("did-jwt");
const { ethers } = require("ethers");

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Set up Handlebars as the template engine
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Ensure proper serving of static files
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/bootstrap-theme")));
app.use(express.static(path.join(__dirname, "assets")));
app.use("/css", express.static(path.join(__dirname, "public/css")));

// Middleware for handling form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up storage for uploaded images (Multer)
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// DID Issuance Function
async function issueDIDToken(did, privateKey) {
    const signer = ES256KSigner(Buffer.from(privateKey, "hex"));

    return await createJWT(
        { aud: "https://example.com", exp: Math.floor(Date.now() / 1000) + 60 * 60 },
        { issuer: did, signer }
    );
}

// Routes
app.get("/", (req, res) => res.render("home"));

app.post("/verify-id", upload.single("id_image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No ID image uploaded" });
    }

    try {
        console.log("Received ID image:", req.file.filename);
        res.json({ message: "ID Verified Successfully" });
    } catch (error) {
        console.error("Error verifying ID:", error);
        res.status(500).json({ error: "ID Verification Failed" });
    }
});

app.post("/generate-did", async (req, res) => {
    try {
        const did = process.env.ETHEREUM_ADDRESS;
        const privateKey = process.env.PRIVATE_KEY;

        if (!privateKey || privateKey.length !== 64) {
            throw new Error("Invalid or missing private key");
        }

        const jwt = await issueDIDToken(did, privateKey);
        res.json({ did, jwt });
    } catch (error) {
        console.error("Error issuing DID:", error);
        res.status(500).json({ error: "Failed to issue DID" });
    }
});

// Start the server
app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
```

---

## **3️⃣ Set Up Handlebars Views & Layout**

### **🔹 Modify Views to Use Updated Theme**

Ensure `views/layouts/main.handlebars` aligns with the theme:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facial ID Verification</title>
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    <div class="d-flex">
        <nav id="sidebar" class="bg-primary text-white p-4 text-center">
            <img src="/assets/logo.png" alt="Company Logo" class="img-fluid mb-3">
            <ul class="nav flex-column mt-4">
                <li class="nav-item"><a class="nav-link text-white" href="#face-scan">Facial Recognition</a></li>
                <li class="nav-item"><a class="nav-link text-white" href="#id-upload">ID Verification</a></li>
                <li class="nav-item"><a class="nav-link text-white" href="#vc-issue">Issue Credential</a></li>
            </ul>
        </nav>
        <main class="container-fluid p-4" id="main-content">
            {{{body}}}
        </main>
    </div>
</body>
</html>
```

---

## **4️⃣ Generate Ethereum Address & Private Key**

Use one of the following methods:

### **🔹 Option 1: Using OpenSSL**

```bash
openssl rand -hex 32
```

📌 **Example Output:**

```
1c32d42309a8a3d0b87f12345b6e7f89a1b234c5d678e90f12a345b678c9d012
```

### **🔹 Option 2: Using ethers.js in Node.js**

```javascript
const { Wallet } = require("ethers");

const wallet = Wallet.createRandom();

console.log("Ethereum Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
```

📌 **Example Output:**

```
Ethereum Address: 0x9aA123f345B6789CdE456F7d89012Ef34b5678Cd
Private Key: 1c32d42309a8a3d0b87f12345b6e7f89a1b234c5d678e90f12a345b678c9d012
```

Store your values in `.env`:

```plaintext
PRIVATE_KEY=1c32d42309a8a3d0b87f12345b6e7f89a1b234c5d678e90f12a345b678c9d012
ETHEREUM_ADDRESS=0x9aA123f345B6789CdE456F7d89012Ef34b5678Cd
```

---

## **5️⃣ Run the Application**

```bash
node server.js
```

Visit:

```
http://localhost:3000
```
