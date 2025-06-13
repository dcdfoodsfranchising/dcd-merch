const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const { initializeSocket } = require("./socket");
const path = require("path");

// Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const dashboardRoutes = require("./routes/dashboard");
const deliveryDetailRoutes = require("./routes/deliveryDetails");
const reviewRoutes = require("./routes/review"); // ✅ Import review routes

const app = express();
const server = http.createServer(app);

// ✅ Initialize WebSockets AFTER server creation
initializeSocket(server);

// Database Connection (Removed Deprecated Options)
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("✅ Connected to MongoDB Atlas."));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  cors({
    origin: "*", // Allow all origins (for development/testing only)
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  })
);

// Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/details", deliveryDetailRoutes);
app.use("/reviews", reviewRoutes);

// Server Initialization
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`🚀 API is now online on port ${PORT}`);
    });
};

// ✅ Fix: Remove circular dependency issue
module.exports = { app, mongoose };
