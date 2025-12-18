# backend/models/vit.py
import torch.nn as nn
from transformers import ViTForImageClassification

class ViT_Emotion(nn.Module):
    def __init__(self, num_classes=7, pretrained=False):
        super(ViT_Emotion, self).__init__()
        # 1. Tải kiến trúc chuẩn của ViT từ Hugging Face
        # Dùng 'google/vit-base-patch16-224' để khớp với kiến trúc file .pth
        base_model = ViTForImageClassification.from_pretrained(
            'google/vit-base-patch16-224', 
            num_labels=num_classes, 
            ignore_mismatched_sizes=True
        )
        
        # 2. Gán các thành phần vào self để khớp tên key trong file .pth
        # File .pth của bạn chứa keys: "vit.embeddings...", "classifier.weight", v.v.
        self.vit = base_model.vit
        self.classifier = base_model.classifier
        
    def forward(self, x):
        # 3. Định nghĩa luồng xử lý
        outputs = self.vit(x)
        
        # Lấy vector đặc trưng của token đầu tiên (CLS token)
        # outputs.last_hidden_state có shape (batch, seq_len, hidden_dim)
        cls_output = outputs.last_hidden_state[:, 0, :]
        
        # Đưa qua lớp phân loại để ra kết quả
        logits = self.classifier(cls_output)
        return logits