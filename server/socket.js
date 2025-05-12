const socketIo = require("socket.io");

let io;

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: {
            origin: ["http://localhost:3000", "https://dcd-merch.vercel.app"], // Allowed origins
            methods: ["GET", "POST"], // Allowed HTTP methods
            credentials: true, // Allow cookies and credentials
        },
    });

    io.on("connection", (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    console.log("✅ WebSocket Server Initialized.");
};

// ✅ Emit new order event
const emitNewOrder = (order) => {
    if (io) {
        io.emit("newOrder", order);
    } else {
        console.error("❌ WebSocket IO is not initialized");
    }
};

// ✅ Emit product update event
const emitProductUpdate = (product) => {
    if (io) {
        console.log("📢 Product Updated:", product);
        io.emit("productUpdated", product);
    } else {
        console.error("❌ WebSocket IO is not initialized");
    }
};

module.exports = { initializeSocket, emitNewOrder, emitProductUpdate };