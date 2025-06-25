/**
 * @file middleware/multer.js
 * @description Multer middleware setup for uploading images directly to Cloudinary.
 * Supports dynamic folder selection and auto-generates a unique `public_id` for each upload.
 */

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Cloudinary instance with API config

/**
 * @desc Configure Cloudinary storage for Multer
 * This setup:
 * - Uses the folder from `req.body.folder`, or defaults to "folder"
 * - Only accepts image formats: jpg, png, jpeg
 * - Stores uploads with a timestamped `public_id`
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // ✅ Optional: log file info during upload (can be removed in production)
    console.log("File being uploaded:", file);
    console.log("Folder:", req.body.folder || "folder");

    const folder = req.body.folder || "folder";

    return {
      folder: folder, // Cloudinary folder (can group by purpose like "avatars", "products", etc.)
      resource_type: "image", // Cloudinary will treat this as an image
      allowed_formats: ["jpg", "png", "jpeg"], // Restrict to specific formats
      public_id: `user-${Date.now()}-${file.originalname}` // Unique ID to avoid collisions
    };
  }
});

// Create Multer middleware using the configured Cloudinary storage
const upload = multer({ storage });

module.exports = upload;
