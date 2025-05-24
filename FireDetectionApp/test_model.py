import cv2

import os
os.environ['CUDA_VISIBLE_DEVICES'] = ''  # Disable GPU



from ultralytics import YOLO
model = YOLO('weights/best.pt')
model.to('cpu') 

img_path = r"C:\Users\THILAK R\Downloads\D-Fire\train\images\WEB09436.jpg"
img = cv2.imread(img_path)  # put image in project folder

# override if necessary

results = model(img)[0]
for det in results.boxes:
    cls_id = int(det.cls[0])
    cls_name = model.names[cls_id]
    print(f"{cls_name}: {det.conf[0]:.2f}")
