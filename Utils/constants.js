module.exports.successConstant = {
  // ### user
  NEW_USER_CREATED: "New user is created successfully",
  LOGOUT: "Logged out successfully",
  PASSWORD_UPDATED: "Successfully password is updated",
  USER_UPDATED: "Successfully user is updated",
  USER_DELETED: "Successfully user is deleted",

  // ### book
  NEW_BOOK_CREATED: "Successfully a new book is added",
  BOOK_UPDATE: "Successfully book details is updated",
  BOOK_DELETED: "Successfully book  is deleted",

  // ### Borrowing
  BORROW_CREATED: "Successfully a new is book is borrowed",
  BORROW_RETURNED: "Successfully book is returned",

  // ### Report
  MOST_BORROWED_BOOKS: "The top 10 most borrowed books",
  MOST_ACTIVE_MEMBERS: "The most active members",
};

module.exports.errorConstant = {
  // ### user
  EMAIL_EXIST: "Email Already Exist",
  EMAIL_NOT_FOUND: "Invalid email or password not match",
  PASSWORD_NOT_MATCH: "Passwords not match",
  OLD_NEW_PASSWORD_SAME: "Old and New Passwords should  not be same",
  NOT_AUTHENTICATED: "Please login to access this resource",
  NOT_AUTHORIZED: "Unathorized to use this  resource",
  NOT_FOUND_REFRESH_TOKEN:
    "Refresh token not found! please pass the refresh token",
  USER_NOT_FOUND: "User not found",

  // ### book
  BOOK_NOT_FOUND: "Book not found with given id",
  BOOK_OUT_OF_STOCK: "Book copies are out-of-stock! retry later on!",

  // ### Borrow
  BORROW_NOT_FOUND: "Borrowing Data  not found witht the given id",
  ALREADY_RETURNED: "Already the book is returned",
};
