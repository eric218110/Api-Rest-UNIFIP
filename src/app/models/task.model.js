import mongoose from "../../database/index.js";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectModel",
    require: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    require: true,
  },
  completed: {
    type: Boolean,
    require: true,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("TaskModel", TaskSchema);
