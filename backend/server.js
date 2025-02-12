require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js'); // Nos aseguramos de que se importe correctamente

const app = express();
app.use(cors());
app.use(express.json());

// Verificar si `userRoutes.js` se está cargando correctamente
console.log("🔹 Intentando cargar userRoutes...");
if (userRoutes) {
    console.log("✅ userRoutes cargado correctamente.");
} else {
    console.log("❌ ERROR: userRoutes no se cargó.");
}

// 🔹 Forzar la carga de las rutas antes de iniciar Express
console.log("🔹 Cargando rutas de usuario...");
app.use('/api', userRoutes);

// 🔹 Mostrar TODAS las rutas activas
console.log("🔹 Rutas registradas en Express:");
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`🔹 Ruta activa: ${r.route.path} - Métodos: ${Object.keys(r.route.methods).join(", ")}`);
    }
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
