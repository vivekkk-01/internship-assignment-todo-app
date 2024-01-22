const { addTask } = require("../controllers/task");

const router = require("express").Router();

router.post("/add-task", addTask);

module.exports = router;
