const mongoose = require("mongoose");
const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    taskCategory: { type: String, required: true },
    taskImage: String,
  },
  { timestamps }
);

module.exports = mongoose.model("Task", taskSchema);
