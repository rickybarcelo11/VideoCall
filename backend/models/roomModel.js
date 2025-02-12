const pool = require('../database/db');

// Obtener todas las salas
const getRooms = async () => {
  const result = await pool.query('SELECT * FROM rooms');
  return result.rows;
};

// Obtener una sala por ID
const getRoomById = async (id) => {
  const result = await pool.query('SELECT * FROM rooms WHERE id = $1', [id]);
  return result.rows[0];
};

// Crear una nueva sala
const createRoom = async (name, createdBy) => {
  const result = await pool.query(
    'INSERT INTO rooms (name, created_by) VALUES ($1, $2) RETURNING *',
    [name, createdBy]
  );
  return result.rows[0];
};

// Eliminar una sala por ID
const deleteRoom = async (id) => {
  const result = await pool.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { getRooms, getRoomById, createRoom, deleteRoom };
