const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUsers, getUserById, getUserByEmail, createUser, deleteUser } = require('../models/userModel');

const router = express.Router();

// 🔹 Verificar si `userRoutes.js` se está ejecutando
console.log("✅ userRoutes.js cargado correctamente");

// 🔹 Registro de usuario
router.post('/register', async (req, res) => {
    console.log("📢 Recibida solicitud a /register");  // 👈 Esto confirmará si la ruta está funcionando
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // Crear usuario con contraseña encriptada
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await createUser(name, email, hashedPassword);

        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar usuario', error: error.message });
    }
});

// 🔹 Inicio de sesión
router.post('/login', async (req, res) => {
    console.log("📢 Recibida solicitud a /login");  // 👈 Esto confirmará si la ruta está funcionando
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar Token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});

// 🔹 Obtener todos los usuarios
router.get('/users', async (req, res) => {
    console.log("📢 Recibida solicitud a /users");  // 👈 Esto confirmará si la ruta está funcionando
    try {
        const users = await getUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
});

// Exportar las rutas
console.log("✅ Rutas registradas en userRoutes.js: /register, /login, /users");
module.exports = router;
