
# 🔥 DL Based Real-Time Forest Fire Detection from Live Feed  
<p align="center">

  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
  </a>

  <a href="https://www.python.org/">
    <img src="https://img.shields.io/badge/Python-3.8%2B-blue.svg" alt="Python">
  </a>

  <a href="https://flask.palletsprojects.com/">
    <img src="https://img.shields.io/badge/Flask-2.0%2B-green.svg" alt="Flask">
  </a>

  <a href="https://www.mongodb.com/">
    <img src="https://img.shields.io/badge/MongoDB-5.0%2B-green.svg" alt="MongoDB">
  </a>

  <img src="https://visitor-badge.laobi.icu/badge?page_id=thilak-r.Forest-fire-detection-using-YOLOv8" alt="Visitors">

</p>

**Keywords:** Forest Fire Detection, Real-Time Fire Monitoring, YOLOv8 Fire Detection, Smoke Detection AI, Computer Vision Wildfire System, Fire Alert System, Live Feed Fire Detection, Flask Fire Detection App, Telegram Fire Alert, Wildfire Prevention AI, Deep Learning Fire Detection  

A powerful computer vision system that leverages **YOLOv8** for detecting **fire** and **smoke** from:  
- 🌄 Uploaded images  
- 🎥 Video streams  
- 🎦 Live webcam feed  

Alerts are sent in real time using **Telegram Bot API** when fire confidence exceeds a critical threshold.

---

## 🚀 Outputs from the System

### 🔥 Fire Detection Output

**Detection Image:**  
![Detection Image](https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/Screenshot%202025-05-24%20191803.png)

**Detection Video:**  
<img src="https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/fire-op-2x.gif" width="700" height="520" />

---

## 💻 Project Frontend

<div align="center">
  <img src="https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/Screenshot%202025-05-24%20191706.png" width="65%" />
  <h2>📡 Real-Time Detection and Alert System</h2>

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/realTime.jpg" width="90%" style="border: 1px solid #ccc; border-radius: 8px;" />
      <p><strong>Live Fire Detection Feed</strong></p>
    </td>
    <td align="center" width="50%">
      <img src="https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/msg.jpg" width="80%" style="border: 1px solid #ccc; border-radius: 8px;" />
      <p><strong>Telegram Fire Alert Notification</strong></p>
    </td>
  </tr>
</table>

<blockquote>
⚠️ Fire alerts are triggered when fire is detected with confidence > 0.75  
💬 Alerts are delivered instantly via <strong>Telegram Bot</strong>
</blockquote>
</div>

---

## 📊 Model Evaluation Results

### 🔹 Metrics Curves

| F1-Confidence Curve | Precision-Recall Curve |
|---------------------|------------------------|
| ![](https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/F1_curve.png) | ![](https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/PR_curve.png) |

| Precision-Confidence | Recall-Confidence |
|----------------------|-------------------|
| ![](https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/P_curve.png) | ![](https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/R_curve.png) |

---

### 🔹 Confusion Matrix & Loss Metrics

<div align="center">
  <img src="https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/confusion_matrix.png" width="45%" />
  <img src="https://raw.githubusercontent.com/ThilakAmalkar/fire-results/main/fireOutputs/results.png" width="65%" />
</div>

---

## 📈 Performance Summary

| Class     | Images | Instances | Precision | Recall | mAP@0.5 | mAP@0.5:0.95 |
|-----------|--------|-----------|-----------|--------|---------|--------------|
| All       | 1722   | 2275      | 0.907     | 0.854  | 0.923   | 0.65         |
| Fire      | 887    | 1002      | 0.943     | 0.914  | 0.963   | 0.732        |
| Smoke     | 498    | 1273      | 0.871     | 0.794  | 0.883   | 0.567        |

---

## 🛠️ How to Run Locally

```bash
# Clone the repository
git clone https://github.com/thilak-r/Forest-fire-detection.git
cd Forest-fire-detection

# (Optional) Create a virtual environment
python -m venv venv

# Activate the environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py
````

---

## 📚 References & Resources

📂 Dataset: [DFireDataset](https://github.com/gaiasd/DFireDataset)
📖 Article: [Stay Ahead of the Flames – Wildfire Detection with YOLOv8](https://medium.com/institute-of-smart-systems-and-ai/stay-ahead-of-the-flames-a-comprehensive-guide-to-wildfire-prevention-with-yolov8-3eb8edd1121a)

## ✅ Keywords
- Forest Fire Detection System  
- Real-Time Fire Detection  
- YOLOv8 Fire and Smoke Detection  
- Wildfire Monitoring AI  
- Fire Alert System Telegram  
- Deep Learning Fire Detection  
- Computer Vision Forest Safety  
- Smoke Detection from Live Feed  
- Flask Fire Detection App  
- AI-based Fire Prevention  
- Wildfire Early Warning System  
- Image and Video Fire Detection  
- Live Webcam Fire Detection  
- Fire Detection Dataset  
- Smart Surveillance Fire Detection  
