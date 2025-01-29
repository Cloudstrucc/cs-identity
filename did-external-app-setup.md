
# **🚀 Setting Up a Node.js App for Facial Recognition, ID Verification, and DID Issuance**

## **📌 Overview**

This guide walks you through creating a **Node.js app with Express.js and Handlebars** that allows users to:

✅ Capture a **user’s photo and ID** for verification.

✅ Perform **face matching** between the live photo and the ID.

✅ Implement **liveness detection** to prevent spoofing.

✅ **Issue a DID (`did:web`)** for the verified user.

✅ **Enhance the UI** using a  **Bootstrap theme** .

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

## **1️⃣ Step 1: Install Node.js and Dependencies**

### **🔹 Install Node.js (If Not Installed)**

Download and install  **Node.js** :

* **Windows/Mac:** [Node.js Official Website](https://nodejs.org/en/download/)
* **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update && sudo apt install nodejs npm -y
  ```

### **🔹 Initialize the Project**

1. Open a terminal and create a new project:
   ```bash
   mkdir facial-id-verification && cd facial-id-verification
   npm init -y
   ```
2. Install  **Express.js, Handlebars, and Bootstrap** :
   ```bash
   npm install express express-handlebars body-parser multer dotenv
   ```
3. Install  **Face Recognition Libraries** :
   ```bash
   npm install @aws-sdk/client-rekognition opencv4nodejs tesseract.js
   ```
4. Install  **DIDKit for DID issuance** :
   ```bash
   npm install didkit
   ```

---

## **2️⃣ Step 2: Download and Set Up a Bootstrap Theme**

We'll use the **[Start Bootstrap Resume](https://startbootstrap.com/previews/resume)** theme for the UI.

### **🔹 Step 1: Download the Theme**

Run the following commands:

```bash
# Navigate to your project folder
cd facial-id-verification

# Download the Resume Bootstrap theme
curl -L -o resume-theme.zip https://github.com/StartBootstrap/startbootstrap-resume/archive/refs/heads/main.zip

# Extract the theme
unzip resume-theme.zip -d public/bootstrap-theme
```

### **🔹 Step 2: Modify Navigation Menu**

Edit `public/bootstrap-theme/index.html` and update the navigation:

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <a class="navbar-brand" href="#">DID Onboarding</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
            <li class="nav-item"><a class="nav-link" href="#face-scan">Facial Recognition</a></li>
            <li class="nav-item"><a class="nav-link" href="#id-upload">ID Verification</a></li>
            <li class="nav-item"><a class="nav-link" href="#vc-issue">Issue Credential</a></li>
        </ul>
    </div>
</nav>
```

---

## **3️⃣ Step 3: Configure Express.js & Handlebars**

### **🔹 Create `server.js`**

Create a new file and add:

```javascript
require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Set Handlebars as the template engine
app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");

// Set static folder for Bootstrap theme
app.use(express.static(path.join(__dirname, "public/bootstrap-theme")));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure file uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Routes
app.get("/", (req, res) => res.render("index"));
app.post("/verify", upload.fields([{ name: "selfie" }, { name: "id_image" }]), require("./routes/verify"));

app.listen(port, () => console.log(`Server running on port ${port}`));
```

---

## **4️⃣ Step 4: Add Facial Recognition & ID Verification UI**

Modify `public/bootstrap-theme/index.html` to include:

```html
<section id="face-scan">
    <div class="container text-center">
        <h2>Facial Recognition</h2>
        <video id="video" width="320" height="240" autoplay></video>
        <button id="capture-btn">Scan Face</button>
        <canvas id="canvas" width="320" height="240" style="display: none;"></canvas>
    </div>
</section>

<section id="id-upload">
    <div class="container text-center">
        <h2>ID Verification</h2>
        <input type="file" id="upload-id" accept="image/*">
        <button id="verify-id-btn">Verify ID</button>
    </div>
</section>
```

---

## **5️⃣ Step 5: Implement Face Recognition & DID Issuance**

Create `routes/verify.js` and add:

```javascript
const AWS = require("@aws-sdk/client-rekognition");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
    const idImage = req.files["id_image"][0].path;
    const selfieImage = req.files["selfie"][0].path;

    // Extract text from ID
    const { data: { text } } = await Tesseract.recognize(idImage, "eng");
    console.log("Extracted ID Text:", text);

    // Compare faces
    const rekognition = new AWS.Rekognition({ region: "us-east-1" });
    const params = {
        SourceImage: { Bytes: fs.readFileSync(idImage) },
        TargetImage: { Bytes: fs.readFileSync(selfieImage) },
        SimilarityThreshold: 90,
    };

    const result = await rekognition.compareFaces(params);
    if (result.FaceMatches.length > 0) {
        console.log("Face Match Successful!");
        const didkit = require("didkit");
        const did = await didkit.generateDid("web", "https://example.com/user/12345");
        res.send(`Verification successful! DID Issued: ${did}`);
    } else {
        res.status(400).send("Face match failed.");
    }
};
```

---

## **6️⃣ Step 6: Run the Application**

Start the server:

```bash
node server.js
```

Visit:

```
http://localhost:3000
```

---

## **🖼️ Onboarding UI Example**

Below is an example of how the UI looks when a user  **registers for a DID** .

![Onboarding Process](https://raw.githubusercontent.com/Cloudstrucc/cs-identity/refs/heads/main/image/visualrepapp.webp)

---

## **🚀 Conclusion**

🎯 **You now have a local Node.js app that:**
✅ Uses **Bootstrap + Handlebars for UI**

✅ Performs **ID OCR & Face Recognition**

✅ Issues **DID:web** for verified users

🔗 **[Next Steps: Deploy Your App](https://github.com/Cloudstrucc/cs-identity/blob/main/deploy-did-onboardapp.md)** 🚀
