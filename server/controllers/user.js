const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary");
const path = require("path");
const { unlink } = require("fs");
const mongoose = require("mongoose");

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

exports.register = async (req, res) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(423).json(error.array()[0].msg);
    }
    const { name, email, password } = req.body;
    const isUser = await User.findOne({ email });
    if (isUser)
      return res.status(401).json("User with that email already exists!");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      picture: user.picture,
      token,
    });
  } catch (error) {
    return res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });
    if (!isUser)
      return res.status(401).json("Invalid email or password. Try again!");
    if (isUser.provider === "Google" && !isUser.password) {
      return res.json({
        provider: true,
        message: `Looks like ${email} was used to create an account with google. Sign in with google or reset your password.`,
      });
    }
    const isPassword = await bcrypt.compare(password, isUser.password);
    if (!isPassword)
      return res.status(401).json("Invalid email or password. Try again!");

    const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET);

    return res.json({
      id: isUser._id,
      email: isUser.email,
      name: isUser.name,
      picture: isUser.picture,
      token,
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

exports.resetPasswordFromEmail = async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ passwordResetToken: hashedToken });
    if (!user) {
      return res.status(401).json("Something went wrong, please try later!");
    }
    if (!user.passwordResetTokenExpire > new Date()) {
      return res.status(401).json("Token is expired, try again later.");
    }

    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save();
    return res.json("Password changed successfully!");
  } catch (error) {
    res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json("Please provide an image!");
    }

    const filePath = path.join(`uploads/images/profile/${req.file.filename}`);

    const { secure_url } = await cloudinary.v2.uploader.upload(filePath);
    console.log("got the request...", secure_url);

    unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });

    const user = await User.findById(req.user.id);

    user.picture = secure_url;
    await user.save();

    return res.json(user.picture);
  } catch (error) {
    res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId.toString() !== req.user.id.toString()) {
      return res
        .status(401)
        .json("You are not authorized to delete this account!");
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json("Something went wrong, please try again later!");
    }

    await Task.deleteMany({ user: new mongoose.Types.ObjectId(userId) });
    await User.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });

    return res.json("You successfully deleted your account!");
  } catch (error) {
    res
      .status(error.statusCode || error.status_code || 500)
      .json(
        error.message || error.msg || "Something went wrong, please try again!"
      );
  }
};
