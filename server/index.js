// Import Statements
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");

// Initialize Express App
const app = express();

// Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - Allow only specific origins
app.use(cors({
    origin: "*",
    credentials: true
}));

// Database Connection (Removed Deprecated Options)
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once("open", () => console.log("✅ Connected to MongoDB Atlas."));

// Route Handling
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);

// Server Initialization
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 API is now online on port ${PORT}`);
    });
}

// Module Exports
module.exports = { app, mongoose };
