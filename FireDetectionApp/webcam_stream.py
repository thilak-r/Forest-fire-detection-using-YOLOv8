import cv2
import threading
from flask import Flask, render_template, Response
from ultralytics import YOLO
import time
from queue import Queue

# Load model once
model = YOLO('weights/best.pt')
app = Flask(__name__)

# Shared frame queue between threads
frame_queue = Queue(maxsize=1)

# Label mapping
CLASS_MAP = {0: 'Smoke', 1: 'Fire'}
COLORS = {'Fire': (0, 0, 255), 'Smoke': (0, 255, 255)}

# ── Background Detection Thread ───────────────────────
def detect_from_camera():
    cap = cv2.VideoCapture(0)
    last_alert_time = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            continue

        results = model(frame)[0]
        for det in results.boxes:
            cls_id = int(det.cls[0])
            conf = float(det.conf[0])
            cls_name = CLASS_MAP.get(cls_id, f"Class {cls_id}")
            x1, y1, x2, y2 = map(int, det.xyxy[0])

            if cls_name == "Fire" and conf > 0.7 and time.time() - last_alert_time > 10:
                print("🔥 FIRE DETECTED")  # Replace with your alert function
                last_alert_time = time.time()

            color = COLORS.get(cls_name, (255, 255, 255))
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{cls_name} {conf:.2f}"
            cv2.putText(frame, label, (x1, y2 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        # Keep only latest frame
        if not frame_queue.full():
            frame_queue.put(frame)
        else:
            try:
                frame_queue.get_nowait()
                frame_queue.put(frame)
            except:
                pass

    cap.release()

# ── Frame Streaming to HTML ──────────────────────────
def gen_frames():
    while True:
        if not frame_queue.empty():
            frame = frame_queue.get()
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        else:
            time.sleep(0.01)

@app.route('/')
def index():
    return render_template('webcam.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# ── Entry Point ──────────────────────────────────────
if __name__ == '__main__':
    threading.Thread(target=detect_from_camera, daemon=True).start()
    app.run(host='0.0.0.0', port=5000, debug=False)
