const express = require("express");
const { Authentication, Authorization } = require("../Middlewares/Auth");
const {
  AdminAddBookController,
  GetSingleBookController,
  AdminUpdateSingleBookController,
  AdminDeleteSingleBookController,
  GetBooksListController,
} = require("../Controllers/book.controller");
const BookRoutes = express.Router();

BookRoutes.route("/:bookId")
  .get(Authentication, GetSingleBookController)
  .put(Authentication, Authorization("admin"), AdminUpdateSingleBookController)
  .delete(
    Authentication,
    Authorization("admin"),
    AdminDeleteSingleBookController
  );

BookRoutes.route("/admin/add").post(
  Authentication,
  Authorization("admin"),
  AdminAddBookController
);

BookRoutes.route("/list/get-all-books").get(
  Authentication,
  GetBooksListController
);

module.exports = BookRoutes;
