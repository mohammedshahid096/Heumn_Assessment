const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
    dependentTaskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },
  },
  { timestamps: true }
);

const dependencyModel = mongoose.model("dependencie", ModelSchema);

module.exports = dependencyModel;
