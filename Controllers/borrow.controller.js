const httpErrors = require("http-errors");
const { successConstant, errorConstant } = require("../Utils/constants");
const borrowModel = require("../Models/borrow.model");
const { createBorrowingValidation } = require("../JoiSchemas/borrow.schema");
const moment = require("moment");
const bookModel = require("../Models/book.model");

// adding a borrow document
module.exports.createBorrowingController = async (req, res, next) => {
  try {
    const { error } = createBorrowingValidation(req.body);
    if (error) {
      return next(httpErrors.BadRequest(error.details[0].message));
    }
    const isBookExist = await bookModel.findById(req.body.bookId);
    if (!isBookExist) {
      return next(httpErrors.NotFound(errorConstant.BOOK_NOT_FOUND));
    }
    if (isBookExist.copies <= 0) {
      return next(
        httpErrors.ServiceUnavailable(errorConstant.BOOK_OUT_OF_STOCK)
      );
    }
    const details = {
      user: req.userid,
      book: req.body.bookId,
      borrowedOn: moment().format(),
    };
    const addNewBorrow = new borrowModel(details);
    await addNewBorrow.save();
    await bookModel.findByIdAndUpdate(isBookExist._id, {
      $inc: { copies: -1 },
    });
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: successConstant.BORROW_CREATED,
      data: addNewBorrow,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// return a borrow book
module.exports.returnBorrowingController = async (req, res, next) => {
  try {
    const { borrowId } = req.params;
    const data = await borrowModel.findByIdAndUpdate(borrowId, {
      isReturn: true,
      returnedOn: moment().format(),
    });
    if (!data) {
      return next(httpErrors.NotFound(errorConstant.BORROW_NOT_FOUND));
    }

    if (data.isReturn) {
      return next(httpErrors.BadRequest(errorConstant.ALREADY_RETURNED));
    }

    await bookModel.findByIdAndUpdate(data.book, {
      $inc: { copies: 1 },
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: successConstant.BORROW_RETURNED,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// my borrowing books
module.exports.myBorrowingHistoryController = async (req, res, next) => {
  try {
    const data = await borrowModel.find({ user: req.userid });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data,
      DataLength: data.length,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};
