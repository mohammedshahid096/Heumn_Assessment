const bookModel = require("../Models/book.model");
const { errorConstant, successConstant } = require("../Utils/constants");
const { v4: uuidv4 } = require("uuid");

module.exports.GetBooksListService = async (parent, args, context, info) => {
  try {
    const { limit = 10, page = 1, genre = "", author = "" } = args;
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

    return {
      success: true,
      statusCode: 200,
      data,
      TotalDocuments,
      activePage: Number(page),
      dataLength: data.length,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.GetSingleBookService = async (parent, args, context, info) => {
  try {
    const { id } = args;
    const data = await bookModel.findById(id);
    if (!data)
      return {
        success: false,
        statusCode: 404,
        message: errorConstant.BOOK_NOT_FOUND,
      };
    return {
      success: true,
      statusCode: 200,
      data,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.AddNewBookService = async (parent, details) => {
  try {
    details.isbn = uuidv4();

    const newBook = new bookModel(details);
    await newBook.save();

    return {
      success: true,
      statusCode: 200,
      message: successConstant.NEW_BOOK_CREATED,
      data: newBook,
    };
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};
