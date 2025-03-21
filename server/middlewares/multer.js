const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // Import Cloudinary setup

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Change folder name as needed
    format: ['jpg', 'png', 'jpeg'], // Corrected from allowed_formats
    public_id: (req, file) => `product-${Date.now()}-${file.originalname}`, // Improved naming
  },
});

// Initialize Multer
const upload = multer({ storage });

module.exports = upload;
