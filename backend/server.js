require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Necesario para el servidor de WebSockets
const { Server } = require("socket.io"); // Importamos socket.io
const userRoutes = require("./routes/userRoutes.js");

const app = express();
app.use(cors());
app.use(express.json());

// Servidor HTTP
const server = http.createServer(app);

// Configuración de Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Permitir conexión del frontend
    methods: ["GET", "POST"],
  },
});

// Manejar conexiones de WebSockets
io.on("connection", (socket) => {
  console.log("🔗 Nuevo cliente conectado:", socket.id);

  // Escuchar mensajes del cliente
  socket.on("sendMessage", (message) => {
    console.log("📩 Mensaje recibido:", message);
    io.emit("receiveMessage", message); // Reenviar a todos los clientes conectados
  });

  // Manejar desconexiones
  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

// Rutas de usuario
app.use("/api", userRoutes);

// Iniciar el servidor HTTP + WebSockets
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
