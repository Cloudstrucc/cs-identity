const faceapi = require("face-api.js");
const { canvas, Image, ImageData } = require("canvas");
const fs = require("fs");

async function loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");
}

async function compareFaces(idPath, selfiePath) {
    await loadModels();
    const idImg = await canvas.loadImage(idPath);
    const selfieImg = await canvas.loadImage(selfiePath);

    const idDescriptor = await faceapi.detectSingleFace(idImg).withFaceLandmarks().withFaceDescriptor();
    const selfieDescriptor = await faceapi.detectSingleFace(selfieImg).withFaceLandmarks().withFaceDescriptor();

    if (!idDescriptor || !selfieDescriptor) {
        return false;
    }

    const distance = faceapi.euclideanDistance(idDescriptor.descriptor, selfieDescriptor.descriptor);
    return distance < 0.6; // Lower means more similarity
}
