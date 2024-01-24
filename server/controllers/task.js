const path = require("path");
const cloudinary = require("cloudinary");
const Task = require("../models/Task");
const { unlink } = require("fs");
const User = require("../models/User");
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

    if (req.file) {
      const filePath = path.join(`uploads/images/task/${req.file.filename}`);
      const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
        filePath
      );
      unlink(filePath, (err) => {
        if (err) {
          throw err;
        }
      });
      task.taskImage = { secure_url, public_id };
    }
    await task.save();
    const user = await User.findById(req.uer.id);
    user.tasks.push(task._id);
    await user.save();
    const status =
      new Date() < new Date(startDate)
        ? "In Complete"
        : new Date() >= new Date(startDate) && new Date() <= new Date(endDate)
        ? "On Going"
        : new Date() < new Date(endDate)
        ? "Completed"
        : null;
    res.json({
      id: task._id,
      title,
      category,
      description,
      status,
      image: task.taskImage.secure_url,
      startDate,
      endDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    return res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
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
            : null,
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
    return res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};

exports.editTask = async (req, res) => {
  try {
    const { taskId } = req.param;
    const { title, category, description, startDate, endDate } = req.body;

    const task = await Task.findById(taskId);
    if (!task)
      return res.status(401).json("You can't update the task. Try again!");

    task.title = title;
    task.description = description;
    task.category = category;
    task.startDate = startDate;
    task.endDate = endDate;

    if (req.file) {
      const filePath = path.join(`uploads/images/task/${req.file.filename}`);
      const { secure_url, public_id } = await cloudinary.v2.uploader.upload(
        filePath
      );
      unlink(filePath, (err) => {
        if (err) {
          throw err;
        }
      });
      task.taskImage = { secure_url, public_id };
    }
    await task.save();
    const status =
      new Date() < new Date(startDate)
        ? "In Complete"
        : new Date() >= new Date(startDate) && new Date() <= new Date(endDate)
        ? "On Going"
        : new Date() < new Date(endDate)
        ? "Completed"
        : null;
    res.json({
      id: task._id,
      title,
      category,
      description,
      status,
      image: task.taskImage.secure_url,
      startDate,
      endDate,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    });
  } catch (error) {
    return res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task)
      return res.status(401).json("You can't delete this task. Try again!");

    if (task.user !== req.user.id)
      return res.status(401).json("You can't delete this task. Try again!");

    const user = await User.findById(req.user.id);
    user.tasks.filter((task) => task.toString() === taskId.toString());
    await user.save();
    await Task.deleteOne({ _id: taskId });

    return res.json("You successfully deleted the Task!");
  } catch (error) {
    return res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};
