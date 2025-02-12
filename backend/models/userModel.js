const pool = require('../database/db');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getUsers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

// Obtener un usuario por ID
const getUserById = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

// Obtener un usuario por Email (para login)
const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// Crear un nuevo usuario con contraseña cifrada
const createUser = async (name, email, password) => {
  const salt = await bcrypt.genSalt(10); // Genera un "sal" para mejorar la seguridad
  const hashedPassword = await bcrypt.hash(password, salt); // Cifra la contraseña

  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

// Eliminar un usuario
const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { getUsers, getUserById, getUserByEmail, createUser, deleteUser };
