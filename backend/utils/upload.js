// backend/utils/upload.js
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with keys from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper function to upload from a buffer (file in memory)
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // 'streamifier' helps to stream a buffer
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'social-app' }, // Optional: folder name in Cloudinary
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    // Create a stream from the buffer and pipe it to Cloudinary
    const streamifier = require('streamifier');
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { upload, uploadToCloudinary };