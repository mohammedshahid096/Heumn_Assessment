const httpErrors = require("http-errors");
const bookModel = require("../Models/book.model");
const {
  addBookValidation,
  updateBookValidation,
} = require("../JoiSchemas/book.schema");
const { v4: uuidv4 } = require("uuid");
const { successConstant, errorConstant } = require("../Utils/constants");

// adding a new book by admin
module.exports.AdminAddBookController = async (req, res, next) => {
  try {
    const { error } = addBookValidation(req.body);
    if (error) {
      return next(httpErrors.BadRequest(error.details[0].message));
    }
    req.body.isbn = uuidv4();

    const newBook = new bookModel(req.body);
    await newBook.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: successConstant.NEW_BOOK_CREATED,
      data: newBook,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// getting a single book details
module.exports.GetSingleBookController = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const data = await bookModel.findById(bookId);
    if (!data) {
      return next(httpErrors.NotFound(errorConstant.BOOK_NOT_FOUND));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// updating  the single book
module.exports.AdminUpdateSingleBookController = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { error } = updateBookValidation(req.body);
    if (error) {
      return next(httpErrors.BadRequest(error.details[0].message));
    }

    const data = await bookModel.findByIdAndUpdate(bookId, req.body, {
      new: true,
    });
    if (!data) {
      return next(httpErrors.NotFound(errorConstant.BOOK_NOT_FOUND));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: successConstant.BOOK_UPDATE,
      data,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// delete  the single book
module.exports.AdminDeleteSingleBookController = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    const data = await bookModel.findByIdAndDelete(bookId);
    if (!data) {
      return next(httpErrors.NotFound(errorConstant.BOOK_NOT_FOUND));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: successConstant.BOOK_DELETED,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// books list with queries and pagination
module.exports.GetBooksListController = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, genre = "", author = "" } = req.query;
    const query = {};
    if (genre) {
      query.genre = genre;
    }
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    const skip_docs = (Number(page) - 1) * limit;
    const data = await bookModel
      .find(query)
      .skip(skip_docs)
      .limit(limit)
      .sort({ createdAt: -1 });

    const TotalDocuments = await bookModel.countDocuments();

    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
      TotalDocuments,
      activePage: Number(page),
      DataLength: data.length,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};
