from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from ultralytics import YOLO
import cv2
import time

app = Flask(__name__)
CORS(app, origins="*")

# Load YOLO models
yolo_face_model = YOLO("./models/yolov11n-face.pt").to('cpu')  # Face detection
classification_model = YOLO("./yolo_classification/weights/best.pt").to('cpu')  # Classification

# Define class labels
classes = ['245322748034', '245322748042', '245322748045']

# Store counts over time
counts_over_time = []

@app.route('/video_feed', methods=['GET'])
def video_feed():
    ip = request.args.get('ip')
    video_stream_url = f"http://{ip}/video"
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        return jsonify({"error": "Failed to open video stream"}), 500

    def generate():
        global counts_over_time
        start_time = time.time()
        detected_classes = set()

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            # Run YOLO inference on the frame
            face_results = yolo_face_model.predict(source=frame, imgsz=224, conf=0.5)
            face_boxes = face_results[0].boxes.xyxy.cpu().numpy() if len(face_results) > 0 else []

            for box in face_boxes:
                x1, y1, x2, y2 = map(int, box[:4])
                cropped_face = frame[y1:y2, x1:x2]

                if cropped_face.size > 0:
                    face_resized = cv2.resize(cropped_face, (224, 224))
                    classification_results = classification_model.predict(source=face_resized, imgsz=224, conf=0.5)

                    if hasattr(classification_results[0], 'probs') and classification_results[0].probs is not None:
                        class_probs = classification_results[0].probs.data
                        predicted_class_idx = class_probs.argmax()
                        confidence = class_probs[predicted_class_idx].item()

                        if confidence > 0.999:
                            detected_classes.add(classes[predicted_class_idx])
                            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                            label = f"{classes[predicted_class_idx]} ({confidence * 100:.1f}%)"
                            cv2.putText(frame, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            # Update counts over time every second
            current_time = time.time()
            if current_time - start_time >= 1:
                counts_over_time.append({"time": int(current_time), "count": len(detected_classes)})
                detected_classes.clear()
                start_time = current_time

            # Encode and stream the frame
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n\r\n')

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/counts', methods=['GET'])
def get_counts():
    """
    Return the sequential data collected over time.
    """
    return jsonify(counts_over_time)

if __name__ == '__main__':
    app.run(debug=True)
