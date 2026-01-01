import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
