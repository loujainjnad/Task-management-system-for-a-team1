import express from "express";
import mongoose from "mongoose";
import notesRoutes from "./routes/notes.js";

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/notes-api")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/notes", notesRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
