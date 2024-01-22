const { googleOauthHandler } = require("../controllers/auth");
const verifyToken = require("../middlewares/verifyToken");

const router = require("express").Router();

router.get("/oauth/google", googleOauthHandler);

router.get("/auth", verifyToken)

module.exports = router;
