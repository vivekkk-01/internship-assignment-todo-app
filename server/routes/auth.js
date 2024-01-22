const { googleOauthHandler } = require("../controllers/auth");

const router = require("express").Router();

router.get("/oauth/google", googleOauthHandler);

module.exports = router;
