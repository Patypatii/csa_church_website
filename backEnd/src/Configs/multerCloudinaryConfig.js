import multer from "multer";
import path from "path";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfigs.js";
import logger from "../logger/winston.js";

// Safety check for Cloudinary credentials
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET;

if (!isCloudinaryConfigured) {
  logger.warn('Cloudinary credentials missing in .env. Photo uploads will fail until configured.');
}

// Cloudinary Storage config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // If credentials are missing, throw an error that the global handler will catch
    if (!isCloudinaryConfigured) {
      throw new Error('Cloudinary credentials missing. Please configure CLOUDINARY_CLOUD_NAME, API_KEY, and API_SECRET in your .env file.');
    }
    
    return {
      folder: "church_officials",
      allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "mov", "avi"],
      resource_type: "auto",
      public_id: file.fieldname + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9)
    };
  },
});

// File type validation
function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    logger.warn(`Unsupported file type attempted: ${ext}`);
    cb(false);
  }
}

// Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter,
});



export default upload;