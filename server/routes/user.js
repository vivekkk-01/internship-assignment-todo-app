const {
  login,
  resetPassword,
  resetPasswordFromEmail,
  register,
  updateProfile,
  deleteUser,
} = require("../controllers/user");
const { body } = require("express-validator");
const verifyToken = require("../middlewares/verifyToken");
const {
  uploadImage,
  validateProfileImage,
} = require("../middlewares/imageUpload");

const router = require("express").Router();

router.post(
  "/register",
  [
    body("name")
      .trim()
      .isString()
      .isLength({ min: 3, max: 30 })
      .withMessage("Name must be between 3 and 30 characters."),
    body("email").trim().isEmail().withMessage("Enter a valid email address."),
    body("password")
      .trim()
      .isString()
      .isLength({ min: 8, max: 30 })
      .withMessage("Password must contain at least 8 characters."),
  ],
  register
);

router.post("/login", login);

router.post("/reset-password", resetPassword);

router.post("/reset-password-with-token", resetPasswordFromEmail);

router.patch(
  "/update-profile",
  verifyToken,
  uploadImage.single("image"),
  validateProfileImage,
  updateProfile
);

router.delete("/delete-user/:userId", verifyToken, deleteUser);

module.exports = router;
