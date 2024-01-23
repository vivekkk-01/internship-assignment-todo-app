const path = require("path");
const cloudinary = require("cloudinary");
const Task = require("../models/Task");
const { unlink } = require("fs");
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
    const tasks = await Task.find({ user: req.user.id });
    if (!tasks)
      return res.json("You haven't created any Task. Create your first Task!");

    const allTasks = tasks.map((task) => {
      return {
        ...task._doc,
        status:
          new Date() < new Date(task.startDate)
            ? "In Complete"
            : new Date() >= new Date(task.startDate) &&
              new Date() <= new Date(task.endDate)
            ? "On Going"
            : new Date() < new Date(task.endDate)
            ? "Completed"
            : null,
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
