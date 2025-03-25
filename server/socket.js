const socketIo = require("socket.io");

let io; // ✅ Declare io globally

const initializeSocket = (server) => {
    io = socketIo(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        console.log(`🔌 New client connected: ${socket.id}`);
        socket.on("disconnect", () => {
            console.log(`❌ Client disconnected: ${socket.id}`);
        });
    });

    console.log("✅ WebSocket Server Initialized.");
};

// ✅ Fix: Define and Export `emitNewOrder` Separately
const emitNewOrder = (order) => {
    if (io) {
        console.log("📢 Emitting New Order:", order);
        io.emit("newOrder", order);
    } else {
        console.error("❌ WebSocket IO is not initialized");
    }
};

module.exports = { initializeSocket, emitNewOrder };
