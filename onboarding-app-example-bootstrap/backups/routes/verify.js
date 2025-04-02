const AWS = require("@aws-sdk/client-rekognition");
const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");
const { createJWT, verifyJWT } = require("did-jwt");

// module.exports = async (req, res) => {
//     const idImage = req.files["id_image"][0].path;
//     const selfieImage = req.files["selfie"][0].path;

//     // Extract text from ID
//     const { data: { text } } = await Tesseract.recognize(idImage, "eng");
//     console.log("Extracted ID Text:", text);

//     // Compare faces
//     const rekognition = new AWS.Rekognition({ region: "us-east-1" });
//     const params = {
//         SourceImage: { Bytes: fs.readFileSync(idImage) },
//         TargetImage: { Bytes: fs.readFileSync(selfieImage) },
//         SimilarityThreshold: 90,
//     };

//     const result = await rekognition.compareFaces(params);
//     if (result.FaceMatches.length > 0) {
//         console.log("Face Match Successful!");
//         const did = "did:ethr:0x123456789abcdef";
//         const privateKey = "your-private-key-here";
//         const jwt = await createJWT({ aud: "https://example.com", exp: Math.floor(Date.now() / 1000) + 60 * 60 },
//             { issuer: did, signer: async (data) => signWithPrivateKey(data, privateKey) });

//         res.send(`Verification successful! DID JWT Issued: ${jwt}`);
//     } else {
//         res.status(400).send("Face match failed.");
//     }
// };

module.exports = async (req, res) => {
    const idImage = req.files["id_image"][0].path;
    const selfieImage = req.files["selfie"][0].path;

    const match = await compareFaces(idImage, selfieImage);
    if (match) {
        res.send("Face match successful!");
    } else {
        res.status(400).send("Face match failed.");
    }
};
