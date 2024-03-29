const User = require("../models/User");
const { getGoogleOauthToken, getGoogleUser } = require("../service");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

exports.googleOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;

    if (!code) {
      return res.status(401).json("Authorization code not provided");
    }

    const { id_token, access_token: accessToken } = await getGoogleOauthToken({
      code,
    });

    const { name, verified_email, email, picture } = await getGoogleUser({
      id_token,
      accessToken,
    });

    if (!verified_email) {
      return res.status(403).json("Google account is not verified!");
    }

    let isUser = await User.findOne({ email });
    if (!isUser)
      isUser = await User.create({
        name,
        email,
        provider: "Google",
        picture,
      });

    const token = jwt.sign(
      { id: isUser._id, name, email, picture: isUser.picture },
      process.env.JWT_SECRET
    );

    return res.redirect(`${process.env.FRONTEND_REDIRECT_LINK}${token}`);
  } catch (err) {
    return res.redirect(process.env.FRONTEND_REDIRECT_ERROR_LINK);
  }
};

exports.getUser = async (req, res) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json("Authentication Failed!");
    token = token.split(" ")[1];
    if (!token) return res.status(401).json("Authentication Failed!");
    jwt.verify(token, process.env.JWT_SECRET, async (err, tokenData) => {
      if (err) return res.status(401).json("Authentication Failed!");
      const tasks = await Task.find({ user: tokenData.id });
      return res.json({ userInfo: { ...tokenData, token }, tasks });
    });
  } catch (error) {
    return res.status(500).json("Something went wrong, please try again!");
  }
};
