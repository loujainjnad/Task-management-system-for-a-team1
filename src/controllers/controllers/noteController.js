import Note from "../models/note.js";

export const createNote = async (req, res) => {
  try {
    const { content, task } = req.body;
    if (!content || !task) 
      return res.status(400).json({ message: "Please write the note and specify the task" });

    const note = await Note.create({
      content,
      task,
      author: req.user.id
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Error creating the note", error: error.message });
  }
};

export const getNotesByTask = async (req, res) => {
  try {
    const notes = await Note.find({ task: req.params.taskId })
      .populate("author", "name")
      .sort({ createdAt: 1 });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error: error.message });
  }
};
