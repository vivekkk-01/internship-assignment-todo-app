const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs");
const path = require("path");

const imageFileFilter = (req, file, cb) => {
  cb(null, true);
};

const uploadImage = multer({ storage, fileFilter: imageFileFilter });

const validateTaskImage = (req, res, next) => {
  if (!req?.file) {
    return next();
  }
  if (req?.file && req.file.size > 5000000)
    return res.status(403).json("Image size is too large.");

  req.file.filename = `task-${Date.now()}-${req.file.originalname}`;
  fs.writeFile(
    path.join(`uploads/images/task/${req.file.filename}`),
    req.file.buffer,
    (err) => {
      if (err) {
        return next(err);
      }
    }
  );
  next();
};

const validateProfileImage = (req, res, next) => {
  if (!req?.file) {
    return res.status(400).json("Provide an Image, please!");
  }
  if (req.file.size > 5000000)
    return res.status(403).json("Image size is too large.");

  if (req.file) {
    req.file.filename = `profile-${Date.now()}-${req.file.originalname}`;
    fs.writeFile(
      path.join(`uploads/images/profile/${req.file.filename}`),
      req.file.buffer,
      (err) => {
        if (err) {
          return next(err);
        }
      }
    );
    next();
  }
};

module.exports = {
  uploadImage,
  validateTaskImage,
  validateProfileImage,
};
