const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "No Description",
    },
    parentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const taskModel = mongoose.model("task", ModelSchema);

module.exports = taskModel;
