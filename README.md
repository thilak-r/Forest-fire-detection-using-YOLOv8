# 🔥 ML Based Real-Time Forest Fire Detection from Live Feed

A powerful computer vision system that leverages YOLOv8 for detecting **fire** and **smoke** from:
- 🌄 Uploaded images
- 🎥 Video streams
- 🎦 Live webcam feed

Alerts are sent in real time using **Telegram Bot API** when fire confidence exceeds a critical threshold.

---

<h2>🚀 Outputs from the System</h2>

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
    <td align="center" width="50%" >
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
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py
```

---
## 📚 References & Resources
### 📂 Dataset: [DFireDataset](https://github.com/gaiasd/DFireDataset) 
### 📖 Article: [Stay Ahead of the Flames – Wildfire Detection with YOLOv8](https://medium.com/institute-of-smart-systems-and-ai/stay-ahead-of-the-flames-a-comprehensive-guide-to-wildfire-prevention-with-yolov8-3eb8edd1121a) <br>
### 💬 Telegram Bot API: Telegram Bot Documentation <br>

---
## 👨‍🏫 Project Mentorship 
Developed under the guidance of 
Dr. Agughasi Victor Ikechukwu
(Asst. Prof. Dept. of CSE-AI)
---
 <a href="https://www.buymeacoffee.com/thilak"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=☕&slug=thilak&button_colour=FFDD00&font_colour=000000&font_family=Bree&outline_colour=000000&coffee_colour=ffffff" /></a> </div>
