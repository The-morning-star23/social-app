const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Enhanced Debugging Log ---
// We log the cloud_name and api_key. We NEVER log the API_SECRET.
console.log('Cloudinary Config Initialized.');
console.log(`Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Loaded' : 'MISSING'}`);
console.log(`API Key: ${process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'MISSING'}`);
console.log(`API Secret: ${process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'MISSING'}`);
// ---------------------------------

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    console.log('Attempting to upload file to Cloudinary...');
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'social-app' },
      (error, result) => {
        if (result) {
          console.log('Cloudinary upload successful.');
          resolve(result);
        } else {
          console.error('Cloudinary upload error:', error);
          reject(error);
        }
      }
    );
    const streamifier = require('streamifier');
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = { upload, uploadToCloudinary };