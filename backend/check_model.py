import torch

# Đường dẫn file model
model_path = "ER_model/vit_model.pth"

try:
    # Load file
    checkpoint = torch.load(model_path, map_location='cpu')
    
    print("✅ Đã load file thành công!")
    print(f"Kiểu dữ liệu: {type(checkpoint)}")

    # TRƯỜNG HỢP 1: File chứa thông tin meta (như class_names)
    if isinstance(checkpoint, dict):
        print("\n--- CÁC KEY TRONG FILE ---")
        print(checkpoint.keys())
        
        # Thử tìm các key chứa tên nhãn
        possible_keys = ['classes', 'class_names', 'labels', 'label_names', 'categories']
        found = False
        for key in possible_keys:
            if key in checkpoint:
                print(f"\n🎉 TÌM THẤY DANH SÁCH NHÃN ({key}):")
                print(checkpoint[key])
                found = True
                break
        
        if not found:
            print("\n⚠️ Không tìm thấy danh sách tên nhãn trực tiếp.")
            
            # Kiểm tra shape của lớp cuối cùng để xác nhận số lượng
            if 'classifier.weight' in checkpoint:
                shape = checkpoint['classifier.weight'].shape
                print(f"Output shape (classifier.weight): {shape}")
                print(f"=> Model này có {shape[0]} đầu ra (classes).")
            elif 'head.weight' in checkpoint: # Một số model đặt tên là head
                shape = checkpoint['head.weight'].shape
                print(f"Output shape (head.weight): {shape}")
            elif 'state_dict' in checkpoint:
                 # Nếu nó lồng trong state_dict
                 sd = checkpoint['state_dict']
                 if 'classifier.weight' in sd:
                     print(f"Output shape: {sd['classifier.weight'].shape}")

    # TRƯỜNG HỢP 2: File chỉ là State Dict (chỉ chứa trọng số)
    else:
        print("\n⚠️ File này chỉ chứa trọng số (State Dict), không có tên nhãn.")

except Exception as e:
    print(f"❌ Lỗi: {e}")