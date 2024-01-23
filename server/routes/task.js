const { addTask, getAllTasks } = require("../controllers/task");
const {
  uploadImage,
  validateTaskImage,
} = require("../middlewares/imageUpload");
const verifyToken = require("../middlewares/verifyToken");
const { body } = require("express-validator");
const router = require("express").Router();

router.post(
  "/add-task",
  verifyToken,
  uploadImage.single("image"),
  validateTaskImage,
  addTask
);

router.get("/get-all-tasks", verifyToken, getAllTasks);

module.exports = router;
