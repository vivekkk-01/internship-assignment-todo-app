const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    taskCategory: { type: String, required: true },
    taskImage: { secure_url: String, public_id: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
