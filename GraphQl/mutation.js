const { AddNewBookService } = require("../Services/book.service");
const { AddNewUserService } = require("../Services/user.service");

module.exports = {
  addNewUser: AddNewUserService,
  addNewBook: AddNewBookService,
};
