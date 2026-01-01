import dotenv from 'dotenv';

dotenv.config();

const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

/**
 * Tạo URL public cho ảnh trên S3
 * @param {string} key - Key/path của ảnh trên S3 (VD: 'images/happy_1.jpg')
 * @returns {string} - URL đầy đủ của ảnh
 */
export const getS3Url = (key) => {
    return `https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${key}`;
};

/**
 * Trích xuất key từ URL S3
 * @param {string} url - URL đầy đủ của ảnh trên S3
 * @returns {string} - Key/path của ảnh
 */
export const getKeyFromS3Url = (url) => {
    const regex = new RegExp(`https://${AWS_S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/(.+)`);
    const match = url.match(regex);
    return match ? match[1] : url;
};

export default { getS3Url, getKeyFromS3Url };
