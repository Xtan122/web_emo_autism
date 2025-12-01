import os
import cv2
import numpy as np
import torch
import base64
import urllib.request
from PIL import Image
from io import BytesIO
from torchvision import transforms
from transformers import ViTForImageClassification, ViTConfig
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import json

EMOTION_MODEL_PATH = "./vit_model.pth"
YUNET_MODEL = "./face_detection_yunet_2023mar.onnx"
SFACE_MODEL = "./face_recognition_sface_2021dec.onnx"
OWNER_IMG = "./user_image.jpg"
SIM_THRESHOLD = 0.6

YUNET_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_detection_yunet/face_detection_yunet_2023mar.onnx"
SFACE_URL = "https://github.com/opencv/opencv_zoo/raw/main/models/face_recognition_sface/face_recognition_sface_2021dec.onnx"
VIT_MODEL_URL = "" 

SKIP_FRAMES = 15

RAW_LABELS = [
    'Genuine_Disgust', 'Posed_Disgust', 'Genuine_Happy', 'Posed_Happy',
    'Genuine_Fear', 'Posed_Fear', 'Genuine_Anger', 'Posed_Anger',
    'Genuine_Surprise', 'Posed_Surprise', 'Genuine_Sadness', 'Posed_Sadness'
]

MERGE_MAPPING = {
    'Genuine_Disgust': 'disgust', 'Posed_Disgust': 'disgust',
    'Genuine_Happy': 'happy',     'Posed_Happy': 'happy',
    'Genuine_Fear': 'fear',       'Posed_Fear': 'fear',
    'Genuine_Anger': 'angry',     'Posed_Anger': 'angry',
    'Genuine_Surprise': 'surprised', 'Posed_Surprise': 'surprised',
    'Genuine_Sadness': 'sad',     'Posed_Sadness': 'sad'
}

app = FastAPI()
app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)

models = {}

def download_file_if_missing(url, filepath):
    if not os.path.exists(filepath):
        print(f"[DOWNLOAD] Đang tải {filepath} từ Internet...")
        try:
            if not url:
                print(f"[WARN] Không có link tải cho {filepath}. Vui lòng copy file này vào thư mục dự án thủ công!")
                return False
            urllib.request.urlretrieve(url, filepath)
            print(f"[DOWNLOAD] Tải thành công: {filepath}")
            return True
        except Exception as e:
            print(f"[ERROR] Không tải được {filepath}: {e}")
            return False
    return True

def compute_cosine_similarity(feat1, feat2):
    if feat1 is None or feat2 is None: return 0.0
    norm1 = np.linalg.norm(feat1)
    norm2 = np.linalg.norm(feat2)
    if norm1 == 0 or norm2 == 0: return 0.0
    return np.dot(feat1, feat2.T) / (norm1 * norm2)

def init_all_models():
    print("[INFO] Đang khởi tạo models...")
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    download_file_if_missing(YUNET_URL, YUNET_MODEL)
    download_file_if_missing(SFACE_URL, SFACE_MODEL)
    has_vit = download_file_if_missing(VIT_MODEL_URL, EMOTION_MODEL_PATH)
    
    if not os.path.exists(YUNET_MODEL) or not os.path.exists(SFACE_MODEL):
        print("[CRITICAL] Thiếu file model OpenCV. Server không thể chạy!")
        exit()
        
    detector = cv2.FaceDetectorYN.create(YUNET_MODEL, "", (320, 320), 0.85, 0.3, 1)
    recognizer = cv2.FaceRecognizerSF.create(SFACE_MODEL, "")
    
    emotion_model = None
    if has_vit and os.path.exists(EMOTION_MODEL_PATH):
        try:
            state_dict = torch.load(EMOTION_MODEL_PATH, map_location=device)
            if 'state_dict' in state_dict: state_dict = state_dict['state_dict']
            
            num_labels = len(RAW_LABELS)
            if 'classifier.weight' in state_dict: num_labels = state_dict['classifier.weight'].shape[0]
            elif 'head.weight' in state_dict: num_labels = state_dict['head.weight'].shape[0]

            config = ViTConfig.from_pretrained("google/vit-base-patch16-224", num_labels=num_labels)
            emotion_model = ViTForImageClassification(config)
            emotion_model.load_state_dict(state_dict, strict=False)
            emotion_model.to(device)
            emotion_model.eval()
            print("[INFO] Đã load ViT Model thành công.")
        except Exception as e:
            print(f"[ERROR] Lỗi load ViT Model: {e}")
    else:
        print("[WARN] KHÔNG TÌM THẤY 'vit_model.pth'. Chức năng cảm xúc sẽ bị tắt!")

    owner_emb = None
    if os.path.exists(OWNER_IMG):
        img = cv2.imread(OWNER_IMG)
        if img is not None:
            h, w = img.shape[:2]
            detector.setInputSize((w, h))
            _, faces = detector.detect(img)
            if faces is not None:
                aligned = recognizer.alignCrop(img, faces[0])
                owner_emb = recognizer.feature(aligned)
            print("[INFO] Đã load Owner Image.")
    else:
        print(f"[INFO] Chưa có ảnh {OWNER_IMG}. Chức năng định danh sẽ luôn trả về False.")

    models['detector'] = detector
    models['recognizer'] = recognizer
    models['emotion'] = emotion_model
    models['device'] = device
    models['owner_emb'] = owner_emb
    print("[INFO] Server sẵn sàng!")

init_all_models()

def process_frame_logic(frame_bgr, cache, run_heavy_ai=False):
    detector = models['detector']
    recognizer = models['recognizer']
    emotion_model = models['emotion']
    device = models['device']
    owner_emb = models['owner_emb']

    h, w = frame_bgr.shape[:2]
    detector.setInputSize((w, h))
    _, faces = detector.detect(frame_bgr)

    result = {
        "found": False,
        "is_owner": cache.get("is_owner", False),
        "emotion": cache.get("emotion", "neutral"),
        "confidence": cache.get("confidence", 0.0),
        "box": []
    }

    if faces is not None and len(faces) > 0:
        face = faces[0]
        result["found"] = True
        result["box"] = face[:4].astype(int).tolist()

        if run_heavy_ai:
            try:
                if owner_emb is not None:
                    aligned_face = recognizer.alignCrop(frame_bgr, face)
                    feat = recognizer.feature(aligned_face)
                    
                    sim = compute_cosine_similarity(feat, owner_emb)
                    is_owner = bool(sim > SIM_THRESHOLD)
                    
                    print(f"[DEBUG] Sim Score: {sim:.4f} | Is Owner: {is_owner}")
                    
                    cache["is_owner"] = is_owner
                    result["is_owner"] = is_owner
                
                if emotion_model is not None:
                    x, y, w_box, h_box = map(int, face[:4])
                    y1, y2 = max(0, y), min(h, y + h_box)
                    x1, x2 = max(0, x), min(w, x + w_box)
                    
                    if y2 > y1 and x2 > x1:
                        face_crop = frame_bgr[y1:y2, x1:x2]
                        face_rgb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
                        pil_img = Image.fromarray(face_rgb)
                        
                        transform = transforms.Compose([
                            transforms.Resize((224, 224)),
                            transforms.ToTensor(),
                            transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
                        ])
                        input_tensor = transform(pil_img).unsqueeze(0).to(device)
                        
                        with torch.no_grad():
                            outputs = emotion_model(input_tensor)
                            probs = torch.nn.functional.softmax(outputs.logits, dim=1)
                            conf, classes = torch.max(probs, 1)
                            idx = classes.item()
                            
                            raw_label = RAW_LABELS[idx] if idx < len(RAW_LABELS) else "unknown"
                            final_label = MERGE_MAPPING.get(raw_label, 'neutral')
                            
                            cache["emotion"] = final_label
                            cache["confidence"] = float(conf.item())
                            result["emotion"] = final_label
                            result["confidence"] = float(conf.item())
            except Exception as e:
                print(f"[WARN] Error in heavy AI processing: {e}")

    return result

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Client connected")
    
    frame_count = 0
    client_cache = {
        "is_owner": False,
        "emotion": "neutral", 
        "confidence": 0.0
    }
    
    try:
        while True:
            data = await websocket.receive_text()
            frame_count += 1
            
            header, encoded = data.split(",", 1)
            img_bytes = base64.b64decode(encoded)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            should_run_heavy = (frame_count % SKIP_FRAMES == 0)
            ai_result = process_frame_logic(frame, client_cache, run_heavy_ai=should_run_heavy)
            
            await websocket.send_text(json.dumps(ai_result))
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        print("Client disconnected")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
