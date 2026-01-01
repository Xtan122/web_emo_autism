import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, bucketName } from '../config/s3.js';

// Upload single image
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Upload ảnh thành công!',
            data: {
                url: req.file.location, // URL của ảnh trên S3
                key: req.file.key,      // Key của ảnh trên S3
                bucket: req.file.bucket, // Bucket name
                size: req.file.size     // Kích thước file
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Upload multiple images
export const uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        const uploadedFiles = req.files.map(file => ({
            url: file.location,
            key: file.key,
            bucket: file.bucket,
            size: file.size
        }));

        res.status(200).json({
            success: true,
            message: `Upload ${req.files.length} ảnh thành công!`,
            data: uploadedFiles
        });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Delete image from S3
export const deleteImage = async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu key của ảnh'
            });
        }

        const deleteParams = {
            Bucket: bucketName,
            Key: key,
        };

        await s3Client.send(new DeleteObjectCommand(deleteParams));

        res.status(200).json({
            success: true,
            message: 'Xóa ảnh thành công!'
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa ảnh',
            error: error.message
        });
    }
};
