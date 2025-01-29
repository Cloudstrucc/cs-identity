document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded!");

    const video = document.getElementById("video");
    const captureBtn = document.getElementById("capture-btn");
    const canvas = document.getElementById("canvas");

    if (!video || !captureBtn || !canvas) {
        console.error("One or more elements are missing. Ensure the HTML contains the necessary elements.");
        return;
    }

    console.log("All required elements found!");

    // Start webcam stream
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => { 
            video.srcObject = stream;
            video.play();
            console.log("Webcam started successfully.");
        })
        .catch(err => console.error("Webcam access denied or failed:", err));

    // Capture face scan
    captureBtn.addEventListener("click", () => {
        const context = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.style.display = "block";
        console.log("Face captured!");
        alert("Face captured! Processing...");
    });
});
