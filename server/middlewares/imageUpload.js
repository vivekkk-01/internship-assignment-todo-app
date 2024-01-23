const multer = require("multer");
const storage = multer.memoryStorage();
const fs = require("fs");
const path = require("path");

const imageFileFilter = (req, file, cb) => {
  cb(null, true);
};

const uploadImage = multer({ storage, fileFilter: imageFileFilter });

const validateTaskImage = (req, res) => {
  if (!req.file.mimetype.startsWith("image"))
    return res.status(403).json("Please provide an image.");

  if (req.file.size > 5000000)
    return res.status(403).json("Image size is too large.");

  req.file.filename = `profile-${Date.now()}-${req.file.originalname}`;

  fs.writeFile(
    path.join(`public/uploads/images/task/${req.file.filename}`),
    req.file.buffer,
    (err) => {
      if (err) {
        next(err);
      }
    }
  );
  next();
};

module.exports = {
  uploadImage,
  validateTaskImage,
};