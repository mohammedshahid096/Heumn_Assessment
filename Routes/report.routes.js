const express = require("express");
const {
  MostBorrowedBooksController,
  MostActiveMembersController,
  BookAvalabilityController,
} = require("../Controllers/report.controller");

const ReportRoutes = express.Router();

ReportRoutes.route("/most-borrowed-books").get(MostBorrowedBooksController);
ReportRoutes.route("/most-active-members").get(MostActiveMembersController);
ReportRoutes.route("/book-availability").get(BookAvalabilityController);

module.exports = ReportRoutes;
