const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    statusId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "status",
      required: true,
    },
  },
  { timestamps: true }
);

const assignedModel = mongoose.model("assigned", ModelSchema);

module.exports = assignedModel;
