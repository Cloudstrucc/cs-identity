# **🚀 Setting Up a Node.js App for Facial Recognition, ID Verification, and DID Issuance**

## **📌 Overview**

This guide will walk you through creating a **Node.js app with Express.js and Handlebars** to:

* Capture a **user’s photo and ID** for verification.
* Perform **face matching** between the live photo and the ID.
* Implement **liveness detection** to prevent spoofing.
* **Issue a DID (`did:web`)** for the verified user.

### **🔹 Tech Stack**

| Component                       | Technology                                        |
| ------------------------------- | ------------------------------------------------- |
| **Backend**               | Node.js, Express.js                               |
| **Frontend UI**           | Handlebars.js (HBS), Bootstrap                    |
| **Face Recognition**      | AWS Rekognition, OpenCV, Microsoft Face API       |
| **OCR for ID Extraction** | Tesseract.js (Open-source OCR), Google Vision API |
| **Liveness Detection**    | iBeta-certified APIs (FaceTec, Onfido)            |
| **DID Issuance**          | DIDKit (`did:web`)                              |

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
2. Install  **Express.js, Handlebars, Bootstrap, and other dependencies** :
   ```bash
   npm install express express-handlebars body-parser multer dotenv tesseract.js axios
   ```
3. Install  **Face Recognition Libraries** :
   ```bash
   npm install @aws-sdk/client-rekognition opencv4nodejs
   ```
4. Install  **DIDKit for DID issuance** :
   ```bash
   npm install didkit
   ```

---

## **2️⃣ Step 2: Configure the Express.js Server**

### **🔹 Create `server.js`**

1. In the root directory, create a file called `server.js`:
   ```bash
   touch server.js
   ```
2. Open `server.js` and add the following code:
   ```javascript
   require("dotenv").config();
   const express = require("express");
   const exphbs = require("express-handlebars");
   const bodyParser = require("body-parser");
   const multer = require("multer");
   const path = require("path");

   const app = express();
   const port = process.env.PORT || 3000;

   // Set up Handlebars as the template engine
   app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
   app.set("view engine", "handlebars");

   // Set static folder for Bootstrap, CSS, and JS
   app.use(express.static(path.join(__dirname, "public")));

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

## **3️⃣ Step 3: Create Handlebars Views**

### **🔹 Set Up Views and Layouts**

1. Create the directories for views:
   ```bash
   mkdir views layouts public uploads
   ```
2. Create  **Main Layout (`views/layouts/main.handlebars`)** :
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Facial ID Verification</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
   </head>
   <body>
       {{{body}}}
   </body>
   </html>
   ```
3. Create  **Home View (`views/home.handlebars`)** :
   ```html
   <div class="container mt-5">
       <h2>Identity Verification</h2>
       <form action="/verify" method="POST" enctype="multipart/form-data">
           <label for="id_image">Upload ID Image:</label>
           <input type="file" name="id_image" required>
           <label for="selfie">Take a Selfie:</label>
           <input type="file" name="selfie" required>
           <button type="submit" class="btn btn-primary mt-3">Verify</button>
       </form>
   </div>
   ```

---

## **4️⃣ Step 4: Implement Face Recognition and DID Issuance**

### **🔹 Create `routes/verify.js`**

1. Create a `routes` folder:
   ```bash
   mkdir routes && touch routes/verify.js
   ```
2. Add the following  **face recognition and ID verification logic** :
   ```javascript
   const AWS = require("@aws-sdk/client-rekognition");
   const Tesseract = require("tesseract.js");
   const fs = require("fs");
   const path = require("path");

   module.exports = async (req, res) => {
       const idImage = req.files["id_image"][0].path;
       const selfieImage = req.files["selfie"][0].path;

       // Step 1: Extract Text from ID
       const { data: { text } } = await Tesseract.recognize(idImage, "eng");
       console.log("Extracted ID Text:", text);

       // Step 2: Compare Face (AWS Rekognition)
       const rekognition = new AWS.Rekognition({ region: "us-east-1" });

       const imageBuffer1 = fs.readFileSync(idImage);
       const imageBuffer2 = fs.readFileSync(selfieImage);

       const params = {
           SourceImage: { Bytes: imageBuffer1 },
           TargetImage: { Bytes: imageBuffer2 },
           SimilarityThreshold: 90,
       };

       const result = await rekognition.compareFaces(params);

       if (result.FaceMatches.length > 0) {
           console.log("Face Match Successful!");

           // Step 3: Issue DID
           const didkit = require("didkit");
           const did = await didkit.generateDid("web", "https://example.com/user/12345");

           res.send(`Verification successful! DID Issued: ${did}`);
       } else {
           res.status(400).send("Face match failed. Please try again.");
       }
   };
   ```

---

## **5️⃣ Step 5: Run the Application**

1. Start the server:
   ```bash
   node server.js
   ```
2. Open your browser and visit:
   ```
   http://localhost:3000
   ```
3. Upload an **ID image** and **selfie** to verify identity.

---

## **🚀 Conclusion**

🎯 **You now have a local Node.js app that:**
✅ Uses **Bootstrap + Handlebars for UI**

✅ Performs **ID OCR & Face Recognition**

✅ Issues **DID:web** for verified users

---

**📌 [Next Steps:](https://github.com/Cloudstrucc/cs-identity/blob/main/deploy-did-onboardapp.md)**

* Deploy to  **AWS, Heroku, or Azure** .
* Integrate with  **OIDC for authentication** .
