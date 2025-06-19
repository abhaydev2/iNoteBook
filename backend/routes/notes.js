const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");

// ROUTE: 1 --> Fetch all notes of the user
router.get("/fetchnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.findAll({
      where: { userId: req.user.id },
    });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTE: 2 --> Add new notes of the user: login required
router.post(
  "/addnotes",
  fetchUser,
  [
    body("title", "Enter a valid title with at least length of 3").isLength({
      min: 3,
    }),
    body(
      "description",
      "Enter a valid description with at least length of 5"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = await Note.create({
        title,
        description,
        tag,
        userId: req.user.id,
      });
      res.json(note);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//ROUTE: 3--> /api/notes/updatenotes. login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!note) {
      return res.status(404).send("Not Found");
    }

    const updatedNote = await note.update({
      title: title || note.title,
      description: description || note.description,
      tag: tag || note.tag,
    });

    res.json({ note: updatedNote });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//ROUTE: 4--> /api/notes/deletenotes. login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    const note = await Note.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!note) {
      return res.status(404).send("Not Found");
    }

    await note.destroy();
    res.json({ success: true, message: "Note has been deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
