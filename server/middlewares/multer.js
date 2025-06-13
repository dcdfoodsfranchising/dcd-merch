const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary setup

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("File being uploaded:", file);
    console.log("Folder:", req.body.folder || "folder");

    const folder = req.body.folder || "folder";
    return {
      folder: folder,
      resource_type: "image",
      allowed_formats: ["jpg", "png", "jpeg"],
      public_id: `user-${Date.now()}-${file.originalname}`,
    };
  },
});

// Initialize Multer
const upload = multer({ storage });

module.exports = upload;