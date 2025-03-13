require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://192.168.0.15:3000",
      methods: ["GET", "POST"],
    },
});

// Almacenar usuarios conectados
let users = {};

io.on("connection", (socket) => {
    console.log(`🔗 Nuevo usuario conectado: ${socket.id}`);

    // Enviar lista de usuarios conectados al nuevo usuario
    socket.emit("users-list", Object.values(users));

    // Almacenar el usuario en la lista
    users[socket.id] = socket.id;

    // Notificar a todos los demás usuarios
    socket.broadcast.emit("user-connected", socket.id);

    // Manejar oferta de WebRTC
    socket.on("offer", (data) => {
        socket.to(data.target).emit("offer", { sender: socket.id, sdp: data.sdp });
    });

    // Manejar respuesta de WebRTC
    socket.on("answer", (data) => {
        socket.to(data.target).emit("answer", { sender: socket.id, sdp: data.sdp });
    });

    // Manejar candidatos ICE
    socket.on("ice-candidate", (data) => {
        socket.to(data.target).emit("ice-candidate", { sender: socket.id, candidate: data.candidate });
    });

    // Manejar desconexión
    socket.on("disconnect", () => {
        console.log(`❌ Usuario desconectado: ${socket.id}`);
        delete users[socket.id]; // Eliminar usuario de la lista
        socket.broadcast.emit("user-disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://192.168.0.15:${PORT}`);
});
