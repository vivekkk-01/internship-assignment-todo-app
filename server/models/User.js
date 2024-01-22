const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: { required: true, type: String },
    email: { required: true, unique: true, type: String },
    password: {
      minLength: 8,
      type: String,
    },
    provider: String,
    picture: {
      type: String,
      default: "https://vectorified.com/images/no-profile-picture-icon-14.png",
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.methods.createPasswordResetToken = async function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.passwordResetTokenExpire = Date.now() + 30 * 60 * 1000; //10 minutes
  return verificationToken;
};

module.exports = mongoose.model("User", userSchema);
