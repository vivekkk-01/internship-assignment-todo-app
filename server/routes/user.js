const { login, resetPassword, resetPasswordFromEmail } = require("../controllers/user");

const router = require("express").Router();

router.post("/login", login);

router.post("/reset-password", resetPassword);

router.post("/reset-password-with-token", resetPasswordFromEmail)

module.exports = router;
