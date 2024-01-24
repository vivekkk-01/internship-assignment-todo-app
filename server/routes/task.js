const { addTask, getAllTasks, editTask } = require("../controllers/task");
const {
  uploadImage,
  validateTaskImage,
} = require("../middlewares/imageUpload");
const verifyToken = require("../middlewares/verifyToken");
const router = require("express").Router();

router.post(
  "/add-task",
  verifyToken,
  uploadImage.single("image"),
  validateTaskImage,
  addTask
);

router.patch(
  "/edit-task/:taskId",
  verifyToken,
  uploadImage.single("image"),
  validateTaskImage,
  editTask
);

router.delete("/delete-task/:taskId", verifyToken)

router.get("/get-all-tasks", verifyToken, getAllTasks);

module.exports = router;
