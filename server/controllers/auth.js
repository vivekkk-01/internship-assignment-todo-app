const User = require("../models/User");
const { getGoogleOauthToken, getGoogleUser } = require("../service");
const jwt = require("jsonwebtoken");

exports.googleOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(401).json("Authorization code not provided");
    }

    const {
      id_token,
      access_token: accessToken,
    } = await getGoogleOauthToken({ code });

    const { name, verified_email, email, picture } = await getGoogleUser({
      id_token,
      accessToken,
    });

    if (!verified_email) {
      return res.status(403).json("Google account is not verified!");
    }

    const isUser = await User.findOne({ email });
    if (!isUser) {
      await User.create({
        name,
        email,
        provider: "Google",
        picture,
      });
    }

    const token = jwt.sign({ name, email, picture }, process.env.JWT_SECRET);
    return res.redirect(`http://localhost:5173/?token=${token}`);
  } catch (err) {
    return res
      .redirect("http://localhost:5173/login")
      .status(err.status_code || 400)
      .json(err.message || "Failed to authorize Google User!");
  }
};
