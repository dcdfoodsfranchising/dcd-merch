/**
 * @file index.js
 * @description Entry point of the backend server. Sets up Express app, connects to MongoDB Atlas, initializes WebSocket (Socket.IO), 
 * serves static files, handles routing, and listens on a specified port.
 * 
 * @version 1.0.0
 * @author 
 * 
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const path = require("path");

const { initializeSocket } = require("./socket");

// Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const dashboardRoutes = require("./routes/dashboard");
const deliveryDetailRoutes = require("./routes/deliveryDetails");
const reviewRoutes = require("./routes/review");

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket support
initializeSocket(server);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => 
  console.log("✅ Connected to MongoDB Atlas.")
);

// Middleware
app.use(express.json()); // Parse incoming JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve static uploaded files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Enable CORS for frontend-backend communication
app.use(
  cors({
    origin: "*", // Allow all origins (update in production)
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

// Mount Routes
app.use("/users", userRoutes);            // User-related routes
app.use("/products", productRoutes);      // Product CRUD and listings
app.use("/orders", orderRoutes);          // Order handling
app.use("/cart", cartRoutes);             // Shopping cart operations
app.use("/wishlist", wishlistRoutes);     // Wishlist functionality
app.use("/dashboard", dashboardRoutes);   // Admin/user dashboard data
app.use("/details", deliveryDetailRoutes);// Delivery address/details
app.use("/reviews", reviewRoutes);        // Product reviews

// start Server
const PORT = process.env.PORT || 3000;

// Prevents the server from starting when imported in test files
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 API is now online on port ${PORT}`);
  });
}

// Export for use in testing or external files
module.exports = { app, mongoose };
