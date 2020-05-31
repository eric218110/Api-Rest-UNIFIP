import express from "express";
import authMiddlewares from "../middlewares/authMiddlewares.js";
import ProjectModel from "../models/project.model.js";
import TaskModel from "../models/task.model.js";

const route = express.Router();

route.use(authMiddlewares);

route.get("/project", async (req, res) => {
  try {
    const project = await ProjectModel.find()
      .populate("user")
      .populate("tasks");
    res.json(project);
  } catch (error) {
    return res.json({
      erro: "Erro list projects",
    });
  }
});

route.get("/project/:projectId", async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.projectId).populate(
      "user"
    );
    res.json(project !== null ? project : { error: "Erro list project" });
  } catch (error) {
    return res.json({
      erro: "Erro list project",
    });
  }
});

route.post("/project/", async (req, res) => {
  const { tasks, title, description } = req.body;

  try {
    const project = await ProjectModel.create({
      title,
      description,
      user: req.userId,
    });

    await Promise.all(
      tasks.map(async (task) => {
        const taskProject = new TaskModel({
          ...task,
          project: project._id,
        });

        await taskProject.save();

        project.tasks.push(taskProject);
      })
    );

    await project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    return res.json({
      erro: "Erro create new project",
    });
  }
});

route.put("/project/:projectId", async (req, res) => {
  const { tasks, title, description } = req.body;

  try {
    const project = await ProjectModel.findByIdAndUpdate(
      req.params.projectId,
      {
        title,
        description,
      },
      { new: true }
    );

    project.task = [];
    await TaskModel.remove({ project: project._id });

    await Promise.all(
      tasks.map(async (task) => {
        const taskProject = new TaskModel({
          ...task,
          project: project._id,
        });

        await taskProject.save();

        project.tasks.push(taskProject);
      })
    );

    await project.save();
    res.json(project);
  } catch (error) {
    console.log(error);
    return res.json({
      erro: "Erro update project",
    });
  }
});

route.delete("/project/:projectId", async (req, res) => {
  try {
    const project = await ProjectModel.findByIdAndRemove(
      req.params.projectId
    ).populate("user");
    res.json(
      project !== null
        ? { status: "Deleted" }
        : { error: "Erro delete project" }
    );
  } catch (error) {
    return res.json({
      erro: "Erro list project",
    });
  }
});
export default route;
