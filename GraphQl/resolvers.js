const {
  GetBooksListService,
  GetSingleBookService,
} = require("../Services/book.service");
const {
  GetAllUserService,
  GetSingleUserService,
} = require("../Services/user.service");
const mutation = require("./mutation");

const resolvers = {
  Query: {
    hello: () => "Hello A Project for Heumn Interactions PVT LTD.",
    getSingleUser: GetSingleUserService,
    GetAllUsers: GetAllUserService,
    getBooksList: GetBooksListService,
    singleBook: GetSingleBookService,
  },
  Mutation: mutation,
};

module.exports = resolvers;
