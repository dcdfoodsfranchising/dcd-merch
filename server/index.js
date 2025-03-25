const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

// Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" },
});

// ✅ MongoDB Connection
const connectDB = async () => {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
        });

        console.log("✅ Connected to MongoDB Atlas.");
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        process.exit(1); // Stop the app if MongoDB fails
    }
};

// Call MongoDB Connection
connectDB();

// WebSocket Setup
io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// ✅ Function to Emit New Orders
const emitNewOrder = (order) => {
    if (io) {
        console.log("📢 Emitting New Order:", order);
        io.emit("newOrder", order);
    } else {
        console.error("❌ WebSocket IO is not initialized");
    }
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*", credentials: true }));

// Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/dashboard", dashboardRoutes);

// Server Initialization
const PORT = process.env.PORT || 3000;
if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`🚀 API is now online on port ${PORT}`);
    });
}

// ✅ Ensure Correct Export
module.exports = { app, mongoose, io, emitNewOrder };
