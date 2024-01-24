const {
  addTask,
  getAllTasks,
  editTask,
  deleteTask,
  getBoards,
} = require("../controllers/task");
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

router.delete("/delete-task/:taskId", verifyToken, deleteTask);

router.get("/get-all-tasks", verifyToken, getAllTasks);

router.get("/get-boards", verifyToken, getBoards);

module.exports = router;
