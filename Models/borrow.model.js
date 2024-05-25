const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "books",
      required: true,
    },
    borrowedOn: {
      type: Date,
      required: true,
    },
    isReturn: {
      type: Boolean,
      default: false,
    },
    returnedOn: {
      type: Date,
    },
  },
  { timestamps: true }
);

const borrowModel = mongoose.model("borrow", ModelSchema);

module.exports = borrowModel;
