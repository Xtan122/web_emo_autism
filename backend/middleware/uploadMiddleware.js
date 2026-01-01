import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3Client, bucketName } from '../config/s3.js';
import path from 'path';

// Cấu hình Multer để upload trực tiếp lên S3
const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Tạo tên file unique với timestamp
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = path.extname(file.originalname);
            const fileName = `images/${uniqueSuffix}${ext}`;
            cb(null, fileName);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    },
    fileFilter: function (req, file, cb) {
        // Chỉ chấp nhận file ảnh
        const filetypes = /jpeg|jpg|png|gif|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)!'));
    }
});

export default upload;
