const pool = require('../database/db');

// Obtener todos los participantes de una sala
const getParticipantsByRoom = async (roomId) => {
  const result = await pool.query('SELECT * FROM participants WHERE room_id = $1', [roomId]);
  return result.rows;
};

// Agregar un participante a una sala
const addParticipant = async (userId, roomId) => {
  const result = await pool.query(
    'INSERT INTO participants (user_id, room_id) VALUES ($1, $2) RETURNING *',
    [userId, roomId]
  );
  return result.rows[0];
};

// Eliminar un participante de una sala
const removeParticipant = async (id) => {
  const result = await pool.query('DELETE FROM participants WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { getParticipantsByRoom, addParticipant, removeParticipant };
