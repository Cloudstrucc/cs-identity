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
    const verifyIdBtn = document.getElementById("verify-id-btn");
    const uploadIdInput = document.getElementById("upload-id");

    verifyIdBtn.addEventListener("click", async () => {
        if (uploadIdInput.files.length === 0) {
            alert("Please upload an ID image first.");
            return;
        }

        const formData = new FormData();
        formData.append("id_image", uploadIdInput.files[0]);

        try {
            const response = await fetch("/verify-id", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                alert("ID Verified: " + result.message);
            } else {
                alert("ID Verification Failed: " + result.error);
            }
        } catch (error) {
            console.error("Error verifying ID:", error);
            alert("An error occurred while verifying your ID.");
        }
    });
    const issueDIDBtn = document.getElementById("issue-vc-btn");

    issueDIDBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/generate-did", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();

            if (response.ok) {
                alert("DID Issued: " + result.did);
            } else {
                alert("Failed to Issue DID: " + result.error);
            }
        } catch (error) {
            console.error("Error issuing DID:", error);
            alert("An error occurred while issuing your DID.");
        }
    });
});


