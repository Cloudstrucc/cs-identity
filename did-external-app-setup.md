
# **🚀 Setting Up a Node.js App for Facial Recognition, ID Verification, and DID Issuance**

## **📌 Overview**

This guide walks you through setting up the  **Node.js onboarding app** , which now integrates the **modified Bootstrap theme** from your repository at:

🔗 [onboarding-app-example-bootstrap](https://github.com/Cloudstrucc/cs-identity/tree/main/onboarding-app-example-bootstrap)

The app features:
✅ **Facial Recognition for user identity verification**

✅ **ID Verification with OCR to extract user details**

✅ **DID Issuance (`did:web`) to create a decentralized identity**

✅ **Bootstrap-based responsive UI** for a professional look

✅ **Integration with DIDKit for DID:web setup**

### **🔹 Tech Stack**

| Component                       | Technology                                  |
| ------------------------------- | ------------------------------------------- |
| **Backend**               | Node.js, Express.js                         |
| **Frontend UI**           | Handlebars.js (HBS), Bootstrap              |
| **Face Recognition**      | AWS Rekognition, OpenCV, Microsoft Face API |
| **OCR for ID Extraction** | Tesseract.js, Google Vision API             |
| **Liveness Detection**    | iBeta-certified APIs (FaceTec, Onfido)      |
| **DID Issuance**          | DIDKit (`did:web`)                        |

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
npm install express express-handlebars body-parser multer dotenv tesseract.js axios
npm install @aws-sdk/client-rekognition opencv4nodejs didkit
```

---

## **2️⃣ Configure the Express.js Server**

### **🔹 Update `server.js` to Use the Custom Theme and DIDKit**

Ensure `server.js` properly references the Bootstrap theme and DIDKit:

```javascript
require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const didkit = require("didkit");

const app = express();
const port = process.env.PORT || 3000;

// Set up Handlebars as the template engine
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Serve the modified Bootstrap theme
app.use(express.static(path.join(__dirname, "public/bootstrap-theme")));

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

// Routes
app.get("/", (req, res) => res.render("home"));
app.post("/verify", upload.fields([{ name: "selfie" }, { name: "id_image" }]), require("./routes/verify"));

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
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
        <nav id="sidebar" class="bg-primary text-white p-4">
            <h2 class="text-white">DID Onboarding</h2>
            <ul class="nav flex-column">
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

### **🔹 Modify `views/home.handlebars` to Include Updated UI and DID Issuance**

```html
<section id="face-scan" class="text-center">
    <h2>Facial Recognition</h2>
    <p>Align your face in the frame to verify your identity.</p>
    <video id="video" width="320" height="240" autoplay></video>
    <button id="capture-btn" class="btn btn-primary mt-3">Scan Face</button>
    <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>
</section>
```

---

## **5️⃣ Run the Application**

Start the server:

```bash
node server.js
```

Open your browser and visit:

```
http://localhost:3000
```

Upload an **ID image** and **selfie** to verify identity and receive a  **DID:web** .

---

## **🚀 Conclusion**

🎯 **You now have a local Node.js onboarding app that:**

✅ Uses **Bootstrap + Handlebars for UI**

✅ Performs **Facial Recognition and ID OCR**

✅ Issues **DID:web** for verified users

Let me know if you need any further refinements! 🚀
