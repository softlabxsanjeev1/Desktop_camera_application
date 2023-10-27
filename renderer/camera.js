const video = document.getElementById("camera");
const captureButton = document.getElementById('capture-image');
const imageTag = document.getElementById('image')

// function to capture image
captureButton.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videowidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL();
    window.electronAPI.sendImage(dataURL);

    // send notification
    new Notification('Image Captures', {
        body: "Image is successfully captured from live video.",
    });
});



// function to use video feature in page
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
    video.srcObject = stream;
});



