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