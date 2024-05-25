const express = require("express");
const { Authentication, Authorization } = require("../Middlewares/Auth");
const {
  createBorrowingController,
  returnBorrowingController,
  myBorrowingHistoryController,
} = require("../Controllers/borrow.controller");

const BorrowingRoutes = express.Router();

BorrowingRoutes.route("/new-borrow/add").post(
  Authentication,
  createBorrowingController
);
BorrowingRoutes.route("/return-borrow/:borrowId").patch(
  Authentication,
  returnBorrowingController
);
BorrowingRoutes.route("/my-borrow-history").get(
  Authentication,
  myBorrowingHistoryController
);

module.exports = BorrowingRoutes;
