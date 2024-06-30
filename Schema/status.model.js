const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "todo",
      enum: ["todo", "progress", "completed", "cancelled"],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const statusModel = mongoose.model("status", ModelSchema);

module.exports = statusModel;
