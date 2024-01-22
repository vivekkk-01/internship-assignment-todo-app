const { login, resetPassword } = require("../controllers/user");

const router = require("express").Router();

router.post("/login", login);

router.post("/reset-password", resetPassword);

module.exports = router;
