const { addTask } = require("../controllers/task");
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
  [
    body("title").trim().isString().withMessage("Provide a Title of the Task!"),
    body("category")
      .trim()
      .isString()
      .withMessage("Provide a Category of the Task!"),
    body("description")
      .trim()
      .isString()
      .withMessage("Provide a Description of the Task!"),
    body("startDate")
      .trim()
      .isString()
      .withMessage("Provide Start Date of the Task!"),
    body("endDate")
      .trim()
      .isString()
      .withMessage("Provide Start Date of the Task!"),
  ],
  uploadImage.single("image"),
  validateTaskImage,
  addTask
);

module.exports = router;
