# 🤖 Hướng dẫn Setup AI Server

## 📋 Yêu cầu hệ thống

### Python & Dependencies
```bash
pip install fastapi uvicorn opencv-python numpy torch torchvision transformers pillow python-multipart websockets
```

### Models cần thiết
1. **YuNet** (Face Detection) - Tự động tải
2. **SFace** (Face Recognition) - Tự động tải  
3. **ViT Model** (`vit_model.pth`) - **Cần BE cung cấp**
4. **User Image** (`user_image.jpg`) - Optional (cho face recognition)

---

## 🚀 Cách chạy

### 1. Start AI Server (Backend)
```bash
cd my-autism-app
python api_server.py
```
Server sẽ chạy tại: `http://localhost:8000`

### 2. Start Frontend (Dev mode)
```bash
npm run dev
```
Frontend chạy tại: `http://localhost:5173`

---

## 🔗 Cách hoạt động

### Flow kết nối:
```
[Browser Camera] → [AiGame.vue] → WebSocket → [api_server.py] → AI Models
                                      ↓
                    [Response JSON] ← └─────────────────────────────┘
```

### WebSocket Endpoint:
- **URL**: `ws://localhost:8000/ws`
- **Input**: Base64 encoded JPEG frames
- **Output**: JSON với cấu trúc:

```json
{
  "found": true,
  "is_owner": false,
  "emotion": "happy",
  "confidence": 0.89,
  "box": [150, 200, 300, 300]
}
```

### Emotions supported:
- `happy` 😄
- `sad` 😢
- `fear` 😨
- `angry` 😡
- `surprised` 😲
- `disgust` 🤢

---

## ⚙️ Cấu hình

### Frontend (AiGame.vue)
```javascript
const WS_URL = 'ws://localhost:8000/ws';  // Đổi URL nếu deploy
```

### Backend (api_server.py)
```python
SKIP_FRAMES = 15        # Frames giữa mỗi lần chạy AI (tối ưu performance)
SIM_THRESHOLD = 0.6     # Ngưỡng nhận diện user (0-1)
```

---

## 🐛 Troubleshooting

### ❌ Lỗi: "WebSocket connection failed"
- Kiểm tra API server có chạy không: `http://localhost:8000`
- Check console log xem có lỗi CORS không

### ❌ Lỗi: "vit_model.pth not found"
- Chức năng emotion sẽ BỊ TẮT
- Liên hệ BE để lấy file model
- Đặt file vào thư mục `my-autism-app/`

### ❌ Lỗi: Camera không hoạt động
- Cho phép quyền truy cập camera trong browser
- Kiểm tra HTTPS nếu deploy production

### ❌ Stats không update
- Mở DevTools → Console để xem logs
- Check: `✅ WebSocket connected to AI server`
- Kiểm tra có phát hiện khuôn mặt không (nhìn thẳng vào camera)

---

## 📦 Files Structure

```
my-autism-app/
├── api_server.py                    # ✅ AI Backend Server
├── vit_model.pth                    # ⚠️ Cần BE cung cấp
├── user_image.jpg                   # Optional
├── face_detection_yunet_*.onnx      # Auto download
├── face_recognition_sface_*.onnx    # Auto download
└── src/
    └── components/
        └── games/
            └── AiGame.vue           # ✅ Frontend với WebSocket
```

---

## 🔄 Workflow cho Team

### Frontend Developer (Bạn):
1. ✅ Đã tích hợp WebSocket vào AiGame.vue
2. ⏳ Đợi BE commit file `vit_model.pth`
3. Test với mock data (hiện tại vẫn hoạt động)

### Backend Developer (Contributor):
1. ⏳ Train/cung cấp file `vit_model.pth` 
2. ⏳ Commit model vào repo hoặc upload Google Drive
3. ⏳ Verify API server chạy ổn định
4. ⏳ Test với Frontend

---

## 📝 Notes cho BE

### Model Requirements:
- **Model type**: ViT (Vision Transformer) từ Hugging Face
- **Base model**: `google/vit-base-patch16-224`
- **Num labels**: 12 (Genuine/Posed × 6 emotions)
- **Input size**: 224x224 RGB
- **Format**: PyTorch `.pth` file với `state_dict`

### Testing API:
```python
# Test local
python api_server.py

# Access docs
# http://localhost:8000/docs
```

---

## 🎯 Production Deployment

### Backend:
```bash
# Đổi host trong api_server.py
uvicorn.run(app, host="0.0.0.0", port=8000)

# Hoặc dùng
uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend:
Update `WS_URL` trong AiGame.vue:
```javascript
const WS_URL = 'ws://your-domain.com/ws';
```

---

## ✨ Tính năng đã implement

- ✅ WebSocket real-time connection
- ✅ Camera stream integration  
- ✅ Emotion visualization với bar chart
- ✅ Smooth animation khi update emotion
- ✅ Dominant emotion display
- ✅ Auto reconnect khi mất kết nối
- ✅ Cleanup resources khi unmount

## 🚧 Cần bổ sung (Optional)

- [ ] Retry logic cho WebSocket
- [ ] Loading state khi đang kết nối
- [ ] Error notification cho user
- [ ] Fallback về mock data khi server down
- [ ] Face bounding box visualization
- [ ] Record session cho analysis
