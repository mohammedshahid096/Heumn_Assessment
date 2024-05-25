const express = require("express");
const IndexRoutes = express.Router();
const UserRoutes = require("./user.routes");
const BookRoutes = require("./book.routes");
const BorrowingRoutes = require("./borrow.routes");
const ReportRoutes = require("./report.routes");

// # User Routes
IndexRoutes.use("/user", UserRoutes);

// # Book Routes
IndexRoutes.use("/book", BookRoutes);

// # Borrow Routes
IndexRoutes.use("/borrow", BorrowingRoutes);

// # Report Routes
IndexRoutes.use("/report", ReportRoutes);

module.exports = IndexRoutes;
