const pool = require("../db/postgres");

async function getAllNotes() {
  const result = await pool.query(
    "SELECT id, title, content, created_at FROM notes ORDER BY id DESC"
  );
  return result.rows;
}

async function getNoteById(id) {
  const result = await pool.query(
    "SELECT id, title, content, created_at FROM notes WHERE id = $1",
    [id]
  );
  return result.rows[0];
}

async function createNote(title, content) {
  const result = await pool.query(
    "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at",
    [title, content]
  );
  return result.rows[0];
}

async function updateNote(id, title, content) {
  const result = await pool.query(
    "UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING id, title, content, created_at",
    [title, content, id]
  );
  return result.rows[0];
}

async function deleteNote(id) {
  const result = await pool.query(
    "DELETE FROM notes WHERE id = $1 RETURNING id",
    [id]
  );
  return result.rows[0];
}

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote
};