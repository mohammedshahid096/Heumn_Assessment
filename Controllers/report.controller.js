const httpErrors = require("http-errors");
const { successConstant } = require("../Utils/constants");
const borrowModel = require("../Models/borrow.model");
const bookModel = require("../Models/book.model");

// most borrowed controller
module.exports.MostBorrowedBooksController = async (req, res, next) => {
  try {
    const aggregationPipeLine = [
      {
        $group: {
          _id: "$book",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "book",
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          _id: 0,
          bookTitle: "$book.title",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ];

    const data = await borrowModel.aggregate(aggregationPipeLine);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: successConstant.MOST_BORROWED_BOOKS,
      data,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// most active  members
module.exports.MostActiveMembersController = async (req, res, next) => {
  try {
    const { topmembers = 10 } = req.query;
    const aggregationPipeLine = [
      {
        $group: {
          _id: "$user",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          MemberName: "$user.name",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: Number(topmembers),
      },
    ];

    const data = await borrowModel.aggregate(aggregationPipeLine);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: successConstant.MOST_ACTIVE_MEMBERS,
      data,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// book avalability
module.exports.BookAvalabilityController = async (req, res, next) => {
  try {
    const aggregationPipeLine = [
      {
        $lookup: {
          from: "borrows",
          localField: "_id",
          foreignField: "book",
          as: "borrowedCopies",
        },
      },
      {
        $project: {
          title: 1,
          author: 1,
          copies: 1,
          BorrowedBooks: {
            $size: {
              $filter: {
                input: "$borrowedCopies",
                as: "borrow",
                cond: { $eq: ["$$borrow.isReturn", false] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          TotalBooks: { $add: ["$copies", "$BorrowedBooks"] },
        },
      },
      {
        $addFields: {
          AvailableBooks: { $subtract: ["$TotalBooks", "$BorrowedBooks"] },
        },
      },
    ];

    const data = await bookModel.aggregate(aggregationPipeLine);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Book Availablity Report of all books",
      data,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};
