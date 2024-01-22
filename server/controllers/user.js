const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });
    if (!isUser)
      return res.status(401).json("Invalid email or password. Try again!");

    if (isUser.provider === "Google") {
      return res.json({
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

exports.resetPassword = async (req, res) => {
  try {
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("Enter your email address!");
    }
    if (user.passwordResetTokenExpire > new Date()) {
      return res
        .status(400)
        .json(
          "You can not ask us to send new email within just 10 minutes of sending an email."
        );
    }
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = `If you requested to reset your password, reset it now within 10 minutes, otherwise the token will expire. <a href="http://localhost:5173/reset-password-from-email/${token}">Reset Password</a>`;
    const msg = {
      from: process.env.EMAIL_ID,
      to: user.email,
      subject: "Password Reset!",
      html: resetUrl,
    };

    await sgMail.send(msg);
    return res.json("Check your mail box!");
  } catch (error) {
    res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};
