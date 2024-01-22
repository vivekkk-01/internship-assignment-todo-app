const { googleOauthHandler, getUser } = require("../controllers/auth");

const router = require("express").Router();

router.get("/oauth/google", googleOauthHandler);

router.get("/auth", getUser)

module.exports = router;
