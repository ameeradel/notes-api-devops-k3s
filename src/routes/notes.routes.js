const express = require("express");
const notesService = require("../services/notes.service");
const logger = require("../utils/logger");

const router = express.Router();

router.get("/notes", async (req, res) => {
  try {
    const notes = await notesService.getAllNotes();
    res.status(200).json(notes);
  } catch (error) {
    logger.error("Failed to fetch notes", { error: error.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/notes/:id", async (req, res) => {
  try {
    const note = await notesService.getNoteById(req.params.id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    logger.error("Failed to fetch note", {
      error: error.message,
      noteId: req.params.id
    });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "title and content are required"
      });
    }

    const note = await notesService.createNote(title, content);
    res.status(201).json(note);
  } catch (error) {
    logger.error("Failed to create note", { error: error.message });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/notes/:id", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "title and content are required"
      });
    }

    const updatedNote = await notesService.updateNote(
      req.params.id,
      title,
      content
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    logger.error("Failed to update note", {
      error: error.message,
      noteId: req.params.id
    });
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/notes/:id", async (req, res) => {
  try {
    const deleted = await notesService.deleteNote(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    logger.error("Failed to delete note", {
      error: error.message,
      noteId: req.params.id
    });
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;