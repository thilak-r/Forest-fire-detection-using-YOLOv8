import cv2
from flask import Flask, render_template, Response
from ultralytics import YOLO
import os
import time
from sendtelegram import send_telegram_alert

# ── Setup ─────────────────────────────────────────────────────────────────
os.environ['CUDA_VISIBLE_DEVICES'] = ''  # Force CPU if needed
model = YOLO('weights/best.pt')
model.to('cpu')

CLASS_MAP = {0: 'Smoke', 1: 'Fire'}
COLORS = {'Fire': (0, 0, 255), 'Smoke': (0, 255, 255)}

app = Flask(__name__)

def gen_webcam_frames():
    cap = cv2.VideoCapture(0)  # Use default webcam
    last_alert_time = 0  # 🔔 Time of last alert

    while cap.isOpened():
        success, frame = cap.read()
        if not success:
            break

        results = model(frame)[0]

        for det in results.boxes:
            cls_id = int(det.cls[0])
            cls_name = CLASS_MAP.get(cls_id, f"Class {cls_id}")
            x1, y1, x2, y2 = map(int, det.xyxy[0])
            conf = float(det.conf[0])

            # 🔥 Fire detection with 10-sec cooldown
            if cls_name == "Fire" and conf > 0.7 and (time.time() - last_alert_time) > 10:
                send_telegram_alert("🔥 FIRE DETECTED IN REAL-TIME WEBCAM STREAM!")
                last_alert_time = time.time()

            color = COLORS.get(cls_name, (255, 255, 255))
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            label = f"{cls_name} {conf:.2f}"
            cv2.putText(frame, label, (x1, y2 + 20), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    cap.release()

@app.route('/')
def index():
    return render_template('webcam.html')

@app.route('/video_feed')
def video_feed():
    return Response(gen_webcam_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(debug=False, port=5001)
