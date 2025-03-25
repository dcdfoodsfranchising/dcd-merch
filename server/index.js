// Import Statements
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http"); // ✅ Import HTTP module
const socketIo = require("socket.io"); // ✅ Import Socket.io
require("dotenv").config();

// Route Imports
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");
const wishlistRoutes = require("./routes/wishlist");
const dashboardRoutes = require("./routes/dashboard");

// Initialize Express App
const app = express();
const server = http.createServer(app); // ✅ Create HTTP server
const io = socketIo(server, {
    cors: {
        origin: "*", // ✅ Allow all origins for now
    },
});

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

// WebSocket Connection
io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
    });
});

// Emit new order event function
const emitNewOrder = (order) => {
    io.emit("newOrder", order); // ✅ Broadcast new order to all clients
};

// Route Handling
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

// Export app, mongoose, and io (WebSockets)
module.exports = { app, mongoose, io, emitNewOrder };
