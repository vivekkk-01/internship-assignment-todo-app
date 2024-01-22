const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });
    if (!isUser)
      return res
        .status(401)
        .json({ message: "Invalid email or password. Try again!" });

    if (isUser.provider === "Google") {
      return res.status(401).json({
        provider: true,
        message: `Looks like ${email} was used to create an account with google. Sign in with google or reset your password.`,
      });
    }
    const isPassword = await bcrypt.compare(password, isUser.password);
    if (!isPassword)
      return res.status(401).json("Invalid email or password. Try again!");

    jwt.sign({ id: isUser._id }, process.env.JWT_SECRET);

    return res.json({
      id: isUser._id,
      email: isUser.email,
      name: isUser.name,
      picture: isUser.picture,
    });
  } catch (error) {
    return res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};
