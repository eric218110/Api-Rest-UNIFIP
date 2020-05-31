import mongoose from "../../database/index.js";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    require: true,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskModel",
    },
  ],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ProjectModel", ProjectSchema);
