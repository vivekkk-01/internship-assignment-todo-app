const path = require("path");
const cloudinary = require("cloudinary");
const Task = require("../models/Task");
const { unlink } = require("fs");
const User = require("../models/User");
const streamifier = require("streamifier");
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

exports.addTask = async (req, res) => {
  try {
    const { title, category, description, startDate, endDate } = req.body;

    const task = await Task.create({
      title,
      taskCategory: category,
      description,
      startDate,
      endDate,
      user: req.user.id,
    });

    const user = await User.findById(req.user.id);
    user.tasks.push(task._id);
    await user.save();
    const status =
      new Date() < new Date(startDate)
        ? "In Complete"
        : new Date() >= new Date(startDate) && new Date() <= new Date(endDate)
        ? "On Going"
        : new Date() < new Date(endDate)
        ? "Completed"
        : "Completed";

    if (req.file) {
      const bufferStream = streamifier.createReadStream(req.file.buffer);
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        bufferStream,
        async (error, { secure_url, public_id }) => {
          if (error) {
            return res
              .status(500)
              .json("Something went wrong, please try again!");
          }
          task.taskImage = { secure_url, public_id };
          await task.save();
          res.json({
            id: task._id,
            title,
            category,
            description,
            status,
            image: secure_url,
            startDate,
            endDate,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          });
        }
      );
      uploadStream.write(req.file.buffer);
      uploadStream.end();
      return;
    }
    res.json({
      id: task._id,
      title,
      category,
      description,
      status,
      startDate,
      endDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    return res.status(500).json("Something went wrong, please try again!");
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    if (!tasks)
      return res.json("You haven't created any Task. Create your first Task!");

    const allTasks = tasks.map((task) => {
      return {
        id: task._id,
        image: task.taskImage?.secure_url,
        status:
          new Date() < new Date(task.startDate)
            ? "In Complete"
            : new Date() >= new Date(task.startDate) &&
              new Date() <= new Date(task.endDate)
            ? "On Going"
            : new Date() < new Date(task.endDate)
            ? "Completed"
            : "Completed",
        title: task.title,
        description: task.description,
        category: task.taskCategory,
        startDate: task.startDate,
        endDate: task.endDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    });
    return res.json([...allTasks]);
  } catch (error) {
    return res.status(500).json("Something went wrong, please try again!");
  }
};

exports.editTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, category, description, startDate, endDate } = req.body;

    const task = await Task.findById(taskId);
    if (!task)
      return res.status(401).json("You can't update the task. Try again!");

    task.title = title;
    task.description = description;
    task.taskCategory = category;
    task.startDate = startDate;
    task.endDate = endDate;
    await task.save();

    const status =
      new Date() < new Date(startDate)
        ? "In Complete"
        : new Date() >= new Date(startDate) && new Date() <= new Date(endDate)
        ? "On Going"
        : new Date() < new Date(endDate)
        ? "Completed"
        : "Completed";

    if (req.file) {
      const bufferStream = streamifier.createReadStream(req.file.buffer);
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        bufferStream,
        async (error, { secure_url, public_id }) => {
          if (error) {
            return res
              .status(500)
              .json("Something went wrong, please try again!");
          }
          task.taskImage = { secure_url, public_id };
          await task.save();
          res.json({
            id: task._id,
            title,
            category,
            description,
            status,
            image: secure_url,
            startDate,
            endDate,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
          });
        }
      );
      uploadStream.write(req.file.buffer);
      uploadStream.end();
      return;
    }

    await task.save();

    res.json({
      id: task._id,
      title,
      category,
      description,
      status,
      startDate,
      endDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    return res.status(500).json("Something went wrong, please try again!");
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task)
      return res.status(401).json("You can't delete this task. Try again!");

    if (task.user.toString() !== req.user.id)
      return res.status(401).json("You can't delete this task. Try again!");

    const user = await User.findById(req.user.id);
    user.tasks = user.tasks.filter(
      (task) => task.toString() !== taskId.toString()
    );
    await user.save();
    await Task.deleteOne({ _id: taskId });

    return res.json("You successfully deleted the Task!");
  } catch (error) {
    return res.status(500).json("Something went wrong, please try again!");
  }
};

exports.getBoards = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    if (!tasks)
      return res.json("You haven't created any Task. Create your first Task!");

    const boards = {
      onGoing: [],
      inComplete: [],
      completed: [],
    };

    const allTasks = tasks.map((task) => {
      return {
        id: task._id,
        image: task.taskImage?.secure_url,
        status:
          new Date() < new Date(task.startDate)
            ? "In Complete"
            : new Date() >= new Date(task.startDate) &&
              new Date() <= new Date(task.endDate)
            ? "On Going"
            : new Date() < new Date(task.endDate)
            ? "Completed"
            : "Completed",
        title: task.title,
        description: task.description,
        category: task.taskCategory,
        startDate: task.startDate,
        endDate: task.endDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      };
    });

    allTasks.forEach((task) => {
      if (task.status === "On Going") {
        boards.onGoing.push(task);
      }
      if (task.status === "In Complete") {
        boards.inComplete.push(task);
      }
      if (task.status === "Completed") {
        boards.completed.push(task);
      }
    });

    return res.json({ ...boards });
  } catch (error) {
    return res.status(500).json("Something went wrong, please try again!");
  }
};
