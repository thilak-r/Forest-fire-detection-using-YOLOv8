
const statusEl = document.getElementById('status'); // Renamed for clarity
const canvas = document.getElementById('canvasOut');
const ctx = canvas.getContext('2d');
const connectionStatusDot = document.getElementById('connectionStatus'); // Renamed
const connectionTextEl = document.getElementById('connectionText'); // Renamed
const fireCountEl = document.getElementById('fireCount'); // Renamed
const smokeCountEl = document.getElementById('smokeCount'); // Renamed
const fpsCounterEl = document.getElementById('fpsCounter'); // Renamed

// Image related elements
const imgInput = document.getElementById('imgInput');
const btnImgDetect = document.getElementById('btnImg'); // Renamed for clarity
// With these two lines:
const imgOriginalPreview = document.getElementById('imgOriginalPreview');
const imgProcessedPreview = document.getElementById('imgProcessedPreview'); // Renamed for clarity
const imageLoader = document.getElementById('imageLoader');
const imageUploadArea = document.getElementById('imageUploadArea');

// Video related elements
const vidInput = document.getElementById('vidInput');
const btnVidUpload = document.getElementById('btnVid'); // Renamed
const btnStopVideo = document.getElementById('btnStopVideo');
const videoUploadArea = document.getElementById('videoUploadArea');


// Webcam related elements
const btnWebcamStart = document.getElementById('btnWebcam'); // Renamed
const btnWebcamStop = document.getElementById('btnStop'); // This is btnStop in HTML

// General UI
const progressBar = document.getElementById('progressBar');

let ws = null;
let webcamStream = null; // To store the webcam MediaStream
let imageCapture = null; // For capturing frames from webcam
let streamInterval = null; // For webcam frame sending interval
let isProcessingVideoOrWebcam = false; // Combined flag for WebSocket-based processing
let currentImageFile = null; // Stores the currently selected/dropped image file

let frameCount = 0;
let lastFrameTime = Date.now();
// Detection counts are updated from server messages if they contain that info
// Or could be parsed from frame analysis if done client-side (not the case here)

// ── WEBSOCKET CONNECTION ───────────────────────────────────────────────────────
function connectWebSocket() {
    if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        console.log('WebSocket already open or connecting.');
        return;
    }

    updateConnectionStatus('connecting', 'Connecting...');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    ws = new WebSocket(`${protocol}//${window.location.host}/video_feed`);
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
        updateConnectionStatus('connected', 'Connected');
        updateStatus('🟢 Connected to server. Ready for video/webcam.');
        isProcessingVideoOrWebcam = false; // Reset processing state on new connection
    };

    ws.onmessage = handleWebSocketMessage;

    ws.onclose = (event) => {
        const reason = event.reason || (event.wasClean ? 'Clean close' : 'Connection died');
        updateConnectionStatus('disconnected', `Disconnected: ${reason}`);
        updateStatus(`🔴 Disconnected. Attempting to reconnect...`);
        isProcessingVideoOrWebcam = false;
        stopActiveStreams(); // Ensure webcam/video processing stops
        setTimeout(connectWebSocket, 3000); // Auto-reconnect
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        updateConnectionStatus('disconnected', 'Connection Error');
        updateStatus('❌ WebSocket connection error.');
        isProcessingVideoOrWebcam = false;
        stopActiveStreams();
        // ws.onclose will likely trigger reconnection attempt
    };
}

// ── WEBSOCKET MESSAGE HANDLER ──────────────────────────────────────────────────
function handleWebSocketMessage(event) {
    if (typeof event.data === 'string') {
        try {
            const message = JSON.parse(event.data);
            console.log('WS Message (JSON):', message);
            if (message.status === 'info' || message.status === 'warning' || message.status === 'error') {
                updateStatus(message.message);
            }
            if (message.message && (message.message.includes('Finished video processing') || message.message.includes('Processing stopped'))) {
                isProcessingVideoOrWebcam = false;
                hideProgressBar();
                btnVidUpload.disabled = false;
                btnWebcamStart.disabled = false;
                btnStopVideo.style.display = 'none';
                btnWebcamStop.style.display = 'none';
            }
             if (message.status === 'error'){
                isProcessingVideoOrWebcam = false;
                hideProgressBar();
                // Optionally re-enable buttons
            }

        } catch (e) {
            console.error('Error parsing JSON message from WebSocket:', e);
            updateStatus('Received malformed message from server.');
        }
    } else if (event.data instanceof ArrayBuffer) {
        displayProcessedFrame(event.data);
        updateFPS();
    }
}

// ── FRAME DISPLAY & FPS ────────────────────────────────────────────────────────
function displayProcessedFrame(arrayBuffer) {
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
        // Resize canvas to match image while maintaining aspect ratio (optional)
        const displayWidth = canvas.clientWidth; // Use current canvas width as reference
        const scale = displayWidth / img.width;
        canvas.width = img.width * scale; // Adjust if needed, or keep fixed
        canvas.height = img.height * scale; // Adjust if needed

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(imageUrl); // Clean up
    };
    img.onerror = () => {
        console.error('Error loading image frame from blob.');
        URL.revokeObjectURL(imageUrl);
    };
    img.src = imageUrl;
}

function updateFPS() {
    frameCount++;
    const now = Date.now();
    const elapsed = now - lastFrameTime;
    if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        fpsCounterEl.textContent = fps;
        frameCount = 0;
        lastFrameTime = now;
    }
}

// ── UI STATUS UPDATES ──────────────────────────────────────────────────────────
function updateStatus(message) {
    if (statusEl) statusEl.textContent = message;
    // Simple parsing for demo; more robust parsing needed for reliable counts
    const fireMatch = message.match(/Fire: (\d+)/i);
    const smokeMatch = message.match(/Smoke: (\d+)/i);
    if (fireMatch && fireCountEl) fireCountEl.textContent = fireMatch[1];
    if (smokeMatch && smokeCountEl) smokeCountEl.textContent = smokeMatch[1];
}

function updateConnectionStatus(status, text) {
    if (connectionStatusDot) connectionStatusDot.className = `status-dot ${status}`;
    if (connectionTextEl) connectionTextEl.textContent = text;
}

function showLoader(loaderElement) {
    if (loaderElement) loaderElement.style.display = 'flex';
}

function hideLoader(loaderElement) {
    if (loaderElement) loaderElement.style.display = 'none';
}

function showProgressBar() {
    if (progressBar) progressBar.style.display = 'block';
}

function hideProgressBar() {
    if (progressBar) progressBar.style.display = 'none';
}

// ── IMAGE DETECTION LOGIC ────────────────────────────────────────────────────
function displayPreviewAndEnableButton(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];
    if (!validTypes.includes(file.type)) {
        alert('Invalid image format. Please select JPEG, PNG, BMP, or TIFF.');
        btnImgDetect.disabled = true;
        imgOutPreview.style.display = 'none';
        currentImageFile = null;
        return;
    }
    if (file.size > 15 * 1024 * 1024) { // Max 15MB
        alert('Image file size should be less than 15MB.');
        btnImgDetect.disabled = true;
        imgOutPreview.style.display = 'none';
        currentImageFile = null;
        return;
    }

    currentImageFile = file;
    const reader = new FileReader();
        reader.onload = (e) => {
        // Show ORIGINAL image
        imgOriginalPreview.src = e.target.result;
        imgOriginalPreview.style.display = 'block';
        
        // Hide processed image and show button
        imgProcessedPreview.style.display = 'none';
        btnImgDetect.disabled = false;
        canvas.style.display = 'none';
    }
    reader.onerror = () => {
        alert('Error reading file.');
        currentImageFile = null;
        btnImgDetect.disabled = true;
        imgOutPreview.style.display = 'none';
    }
    reader.readAsDataURL(file);
    hideLoader(imageLoader); // Hide loader if it was shown for upload
}

function performImageDetection() {
    btnImgDetect.disabled = true;
    if (!currentImageFile) {
        alert('Please select an image file first.');
        return;
    }

    showLoader(imageLoader);
    updateStatus('🔍 Analyzing image for fire and smoke...');
    btnImgDetect.disabled = true; // Disable button during processing

    const formData = new FormData();
    formData.append('imageFile', currentImageFile);

    fetch('/upload_image', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errData => {
                throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
            }).catch(() => { // Fallback if JSON parsing fails
                throw new Error(`HTTP error! Status: ${response.status}`);
            });
        }
        return response.blob();
    })
    .then(blob => {
    const objectURL = URL.createObjectURL(blob);
    // Show PROCESSED image
    imgProcessedPreview.src = objectURL;
    imgProcessedPreview.style.display = 'block';
    imgOriginalPreview.style.display = 'block'; // Keep original visible
})
    .catch(error => {
        console.error('Image processing error:', error);
        updateStatus(`❌ Image processing failed: ${error.message}`);
        // Optionally, clear the preview or show a placeholder error image
        // imgOutPreview.style.display = 'none';
    })
    .finally(() => {
    hideLoader(imageLoader);
    btnImgDetect.disabled = false;
});
}

// ── VIDEO PROCESSING LOGIC ───────────────────────────────────────────────────
function handleVideoUpload() {
    const file = vidInput.files[0];
    if (!file) {
        alert('Please select a video file.');
        return;
    }
    const validTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/wmv', 'video/flv'];
    if (!validTypes.includes(file.type)) {
        alert('Invalid video format. Please select MP4, AVI, MOV, MKV, WMV, or FLV.');
        return;
    }
    if (file.size > 200 * 1024 * 1024) { // Max 200MB for video
        alert('Video file size should be less than 200MB.');
        return;
    }

    if (!ws || ws.readyState !== WebSocket.OPEN) {
        updateStatus('Connecting to server for video processing...');
        connectWebSocket(); // Ensure connection is active
        // Wait a bit for connection then try again, or disable button until connected
        setTimeout(() => { if (ws && ws.readyState === WebSocket.OPEN) handleVideoUpload(); }, 2000);
        return;
    }
    if (isProcessingVideoOrWebcam) {
        alert('Another video or webcam stream is currently active.');
        return;
    }

    showProgressBar();
    updateStatus('📤 Uploading video...');
    btnVidUpload.disabled = true;

    const formData = new FormData();
    formData.append('videoFile', file);

    fetch('/upload_video', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.filename) {
            isProcessingVideoOrWebcam = true;
            btnStopVideo.style.display = 'inline-flex';
            imgOutPreview.style.display = 'none'; // Hide image preview
            canvas.style.display = 'block'; // Show canvas for video output
            updateStatus('🎬 Processing video...');
            ws.send(JSON.stringify({ command: 'start_file', filename: data.filename }));
        } else {
            throw new Error(data.error || 'Video upload failed at server.');
        }
    })
    .catch(error => {
        console.error('Video upload error:', error);
        updateStatus(`❌ Video upload failed: ${error.message}`);
        hideProgressBar();
        btnVidUpload.disabled = false;
    });
}

function stopVideoProcessing() {
    if (ws && ws.readyState === WebSocket.OPEN && isProcessingVideoOrWebcam) {
        ws.send(JSON.stringify({ command: 'stop' }));
        updateStatus('⏹️ Stopping video processing...');
    }
    isProcessingVideoOrWebcam = false;
    hideProgressBar();
    btnStopVideo.style.display = 'none';
    btnVidUpload.disabled = false;
    // Canvas will stop receiving frames.
}

// ── WEBCAM FUNCTIONALITY ──────────────────────────────────────────────────────
async function startWebcam() {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        updateStatus('Connecting to server for webcam...');
        connectWebSocket();
        setTimeout(() => { if (ws && ws.readyState === WebSocket.OPEN) startWebcam(); }, 2000);
        return;
    }
     if (isProcessingVideoOrWebcam) {
        alert('Another video or webcam stream is currently active.');
        return;
    }

    updateStatus('📷 Requesting camera access...');
    btnWebcamStart.disabled = true;

    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15 } }
        });
        
        const videoTrack = webcamStream.getVideoTracks()[0];
        imageCapture = new ImageCapture(videoTrack);

        isProcessingVideoOrWebcam = true;
        ws.send(JSON.stringify({ command: 'start_webcam' })); // Inform server
        btnWebcamStop.style.display = 'inline-flex';
        imgOutPreview.style.display = 'none'; // Hide image preview
        canvas.style.display = 'block'; // Show canvas for webcam output
        updateStatus('📹 Camera active. Streaming frames...');

        streamInterval = setInterval(async () => {
            if (!isProcessingVideoOrWebcam || !imageCapture || !ws || ws.readyState !== WebSocket.OPEN) {
                stopWebcam(); // Clean stop if conditions change
                return;
            }
            try {
                const blob = await imageCapture.grabFrame().then(bitmap => {
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = bitmap.width;
                    tempCanvas.height = bitmap.height;
                    tempCanvas.getContext('2d').drawImage(bitmap, 0, 0);
                    bitmap.close(); // Close the ImageBitmap
                    return new Promise(resolve => tempCanvas.toBlob(resolve, 'image/jpeg', 0.8));
                });

                if (blob) {
                     const arrayBuffer = await blob.arrayBuffer();
                     if (ws.readyState === WebSocket.OPEN) {
                        ws.send(arrayBuffer);
                     }
                }
            } catch (frameError) {
                console.error('Error capturing or sending webcam frame:', frameError);
                // Potentially stop webcam if errors persist
            }
        }, 1000 / 15); // Approx 15 FPS

    } catch (error) {
        console.error('Camera access error:', error);
        updateStatus(`❌ Camera access denied or error: ${error.message}`);
        alert('Camera access denied or not available. Please check permissions and try again.');
        btnWebcamStart.disabled = false;
        isProcessingVideoOrWebcam = false;
    }
}

function stopWebcam() {
    if (streamInterval) {
        clearInterval(streamInterval);
        streamInterval = null;
    }
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
        imageCapture = null;
    }
    if (ws && ws.readyState === WebSocket.OPEN && isProcessingVideoOrWebcam) { // Only send stop if it was processing
        ws.send(JSON.stringify({ command: 'stop' }));
    }
    isProcessingVideoOrWebcam = false;
    updateStatus('⏹️ Camera stopped.');
    btnWebcamStop.style.display = 'none';
    btnWebcamStart.disabled = false;
}

function stopActiveStreams() { // General stop for WS based processing
    if (streamInterval) clearInterval(streamInterval);
    if (webcamStream) webcamStream.getTracks().forEach(track => track.stop());
    btnStopVideo.style.display = 'none';
    btnWebcamStop.style.display = 'none';
    btnVidUpload.disabled = false;
    btnWebcamStart.disabled = false;
    hideProgressBar();
}


// ── DRAG & DROP FUNCTIONALITY ──────────────────────────────────────────────────
function setupDragAndDrop() {
    // Image drag & drop
    setupDropZone(imageUploadArea, imgInput, displayPreviewAndEnableButton);
    // Video drag & drop
    setupDropZone(videoUploadArea, vidInput, () => {
        // Directly call handleVideoUpload if a file is dropped
        if (vidInput.files && vidInput.files.length > 0) {
            handleVideoUpload();
        }
    });
}

function setupDropZone(dropZone, fileInputElement, fileHandlerCallback) {
    dropZone.addEventListener('click', (e) => {
        // Prevent click if it's inside a button within the dropzone
        if (e.target.tagName !== 'BUTTON' && e.target.parentElement.tagName !== 'BUTTON') {
             fileInputElement.click();
        }
    });
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
    });
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInputElement.files = files; // Assign to input for consistency
            fileHandlerCallback(files[0]); // Pass the first file to the handler
        }
    });
}


// ── FULLSCREEN & SAVE FRAME FUNCTIONALITY ──────────────────────────────────────
function setupFullscreen() {
    const fullscreenBtn = document.getElementById('btnFullscreen');
    const modal = document.getElementById('fullscreenModal');
    const closeBtn = document.getElementById('closeModal');
    const fullscreenCanvas = document.getElementById('fullscreenCanvas');

    if (!fullscreenBtn || !modal || !closeBtn || !fullscreenCanvas) return;

    fullscreenBtn.addEventListener('click', () => {
        const sourceCanvas = (canvas.style.display !== 'none') ? canvas : ((imgOutPreview.style.display !== 'none') ? imgOutPreview : null);
        if (!sourceCanvas) {
            alert("No content to display in fullscreen.");
            return;
        }

        fullscreenCanvas.width = sourceCanvas.naturalWidth || sourceCanvas.width;
        fullscreenCanvas.height = sourceCanvas.naturalHeight || sourceCanvas.height;
        const fsCtx = fullscreenCanvas.getContext('2d');
        fsCtx.drawImage(sourceCanvas, 0, 0, fullscreenCanvas.width, fullscreenCanvas.height);
        modal.style.display = 'flex'; // Use flex for centering
    });
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
}

function saveFrame() {
    const sourceCanvas = (canvas.style.display !== 'none' && canvas.width > 0 && canvas.height > 0) ? canvas 
                       : ((imgOutPreview.style.display !== 'none' && imgOutPreview.src && imgOutPreview.src !== window.location.href) ? imgOutPreview : null);

    if (!sourceCanvas) {
        alert("No active image or video frame to save.");
        return;
    }
    
    let dataURL;
    if (sourceCanvas.tagName === 'IMG') { // If it's the preview image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceCanvas.naturalWidth;
        tempCanvas.height = sourceCanvas.naturalHeight;
        tempCanvas.getContext('2d').drawImage(sourceCanvas, 0, 0);
        dataURL = tempCanvas.toDataURL('image/png');
    } else { // If it's the canvas
         dataURL = sourceCanvas.toDataURL('image/png');
    }

    const link = document.createElement('a');
    link.download = `fire_detection_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`;
    link.href = dataURL;
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Clean up
}

// ── INITIALIZATION & EVENT LISTENERS ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Initial UI state
    btnImgDetect.disabled = true;
    imgOutPreview.style.display = 'none';
    canvas.style.display = 'none'; // Initially hide canvas too
    btnStopVideo.style.display = 'none';
    btnWebcamStop.style.display = 'none';
    hideLoader(imageLoader);
    hideProgressBar();

    // Setup drag and drop
    setupDragAndDrop();
    setupFullscreen();

    // Image detection
    imgInput.addEventListener('change', (event) => {
        if (event.target.files && event.target.files[0]) {
            displayPreviewAndEnableButton(event.target.files[0]);
        }
    });
    btnImgDetect.addEventListener('click', performImageDetection);

    // Video processing
    vidInput.addEventListener('change', (event) => { // Allow selection via click too
         if (event.target.files && event.target.files[0]) {
            handleVideoUpload();
        }
    });
    btnVidUpload.addEventListener('click', () => vidInput.click()); // Trigger file input
    btnStopVideo.addEventListener('click', stopVideoProcessing);

    // Webcam
    btnWebcamStart.addEventListener('click', startWebcam);
    btnWebcamStop.addEventListener('click', stopWebcam);

    // Frame saving
    document.getElementById('btnSaveFrame').addEventListener('click', saveFrame);

    // Initialize WebSocket connection
    updateStatus('🚀 System ready. Select an image or start video/webcam.');
    connectWebSocket();
});

// ── KEYBOARD SHORTCUTS ────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') { e.preventDefault(); saveFrame(); }
        if (e.key === 'f') { e.preventDefault(); document.getElementById('btnFullscreen')?.click(); }
    }
    if (e.key === 'Escape') {
        const modal = document.getElementById('fullscreenModal');
        if (modal) modal.style.display = 'none';
    }
});

// ── GLOBAL ERROR HANDLING (Optional but good practice) ────────────────────────
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    updateStatus(`❌ Client-side error: ${event.reason.message || 'Unhandled rejection'}`);
});
window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);
    updateStatus(`❌ Client-side script error: ${event.message}`);
});
