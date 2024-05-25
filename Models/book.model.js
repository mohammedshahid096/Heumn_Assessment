const mongoose = require("mongoose");

const ModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      require: true,
      unique: true,
    },
    publication_date: {
      type: String,
      require: true,
    },
    genre: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Romance",
        "Science Fiction",
        "Fantasy",
        "Horror",
        "Historical Fiction",
        "Young Adult",
        "Middle Grade",
        "Children's Books",
        "Graphic Novels",
      ],
    },
    copies: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

const bookModel = mongoose.model("book", ModelSchema);

module.exports = bookModel;
