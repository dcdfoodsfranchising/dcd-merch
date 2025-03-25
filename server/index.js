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
    cors: {
        origin: "*",
    },
});

// WebSocket Setup
io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// ✅ Fix: Properly Define `emitNewOrder`
const emitNewOrder = (order) => {
    if (io) {
        io.emit("newOrder", order);
        console.log("📢 New order emitted:", order);
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

// ✅ Fix: Export correctly
module.exports = { app, mongoose, io, emitNewOrder };
