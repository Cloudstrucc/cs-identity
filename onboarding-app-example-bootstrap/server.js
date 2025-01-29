require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { createJWT, ES256KSigner } = require("did-jwt");
const { ethers } = require("ethers"); // Needed for private key signing

const app = express();
const port = process.env.PORT || 3000;

// ✅ Enable CORS
app.use(cors());

// ✅ Set up Handlebars as the template engine
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// ✅ Serve static files (Ensures Bootstrap theme, CSS, and Logo load properly)
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/bootstrap-theme")));
app.use(express.static(path.join(__dirname, "assets"))); // Ensure the logo loads
app.use("/css", express.static(path.join(__dirname, "public/css")));

// ✅ Middleware for handling form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ✅ Set up storage for uploaded images (Multer)
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// ✅ Ensure Private Key is Loaded Securely
const PRIVATE_KEY = process.env.PRIVATE_KEY || "YOUR_PRIVATE_KEY_HERE"; // Use environment variable

if (!PRIVATE_KEY || PRIVATE_KEY.length !== 64) {
    console.error("❌ Private key is missing or invalid. Ensure a valid 64-character hex key is set.");
    process.exit(1);
}

// ✅ Serve Home Page
app.get("/", (req, res) => res.render("home"));

// ✅ ID Verification Route
app.post("/verify-id", upload.single("id_image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No ID image uploaded" });
    }

    try {
        // Simulating ID OCR and verification
        console.log("📸 Received ID image:", req.file.filename);
        res.json({ message: "✅ ID Verified Successfully" });
    } catch (error) {
        console.error("❌ Error verifying ID:", error);
        res.status(500).json({ error: "ID Verification Failed" });
    }
});

// ✅ DID Issuance Function
async function issueDIDToken(did) {
    try {
        const signer = ES256KSigner(Buffer.from(PRIVATE_KEY, "hex"));

        const jwt = await createJWT(
            { aud: "https://example.com", exp: Math.floor(Date.now() / 1000) + 60 * 60 },
            { issuer: did, signer }
        );

        return jwt;
    } catch (error) {
        console.error("❌ Error creating JWT:", error);
        throw new Error("DID issuance failed.");
    }
}

// ✅ Generate DID Route
app.post("/generate-did", async (req, res) => {
    try {
        const did = "did:ethr:0xYourEthereumAddress"; // Replace with real DID

        const jwt = await issueDIDToken(did);
        res.json({ did, jwt });
    } catch (error) {
        console.error("❌ Error issuing DID:", error);
        res.status(500).json({ error: "Failed to issue DID" });
    }
});

// ✅ Start the server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
