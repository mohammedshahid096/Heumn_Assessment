module.exports = (req, res) => {
  const BASE = req.protocol + "://" + req.get("host") + "/api/v1/";

  res.status(200).json({
    success: true,
    statusCode: 200,
    Welcome: "Welcome to server! it is running perfectly",
    links: {
      gitRepository: "https://github.com/mohammedshahid096/Heumn_Assessment",
      postmanAPIDocumentation:
        "https://documenter.getpostman.com/view/28253165/2sA3QqgDJw",
      graphqlGUI: req.protocol + "://" + req.get("host") + "/gqlserver",
    },
    Details: {
      concept: "used a Refresh Token and Access Token Concept",
      AccessToken: "Access Token will expire in 5 min",
      RefreshToken: "Reresh Token is a long term token",
      BaseApiToHitAPIs: "/api/v1/routes",
    },
    GeneratingAccessToken: {
      ApiName: "Generating a Access-Token",
      url: BASE + "user/get_access_token",
      method: "GET",
      details:
        "this api will send a new access token with the help of refresh token",
    },
    RestApi: {
      userAPI: [
        {
          ApiName: "Register User",
          url: BASE + "user/register",
          method: "POST",
          body: {
            name: "Test2",
            email: "test2@gmail.com",
            password: "Test@123",
          },
          details: "this api will add the user",
        },
        {
          ApiName: "Register User",
          url: BASE + "user/login",
          method: "POST",
          body: {
            email: "test2@gmail.com",
            password: "Test@123",
          },
          details:
            "this api will send cookies like access token, refresh token if login successfull",
        },
        {
          ApiName: "Generating a Access-Token",
          url: BASE + "user/get_access_token",
          method: "GET",
          details:
            "this api will send a new access token with the help of refresh token",
        },
        {
          ApiName: "Logout",
          url: BASE + "user/logout",
          method: "GET",
          details: "this api clear all the cookies and will get logout",
        },
      ],
      bookAPI: [
        {
          ApiName: "Get Single Book",
          url: BASE + "book/{book_id}",
          method: "GET",
          details: "this api will return single book details",
        },
        {
          ApiName: "Book List with Query",
          url: BASE + "book/list/get-all-books",
          method: "GET",
          query: [
            { key: "limit", default: 10 },
            { key: "page", default: 1 },
            { key: "author", default: null },
            { key: "genre", default: null },
          ],
          details:
            "this api will return list of books with pagination and queries",
        },
      ],
      borrowAPI: [
        {
          ApiName: "Add New Borrow",
          url: BASE + "borrow/new-borrow/add",
          method: "POST",
          body: {
            bookId: "{book_id}",
          },
          details: "this api will add the borrow  ",
        },
        {
          ApiName: "Return Borrowed Book",
          url: BASE + "borrow/return-borrow/{borrow_id}",
          method: "PATCH",
          details: "this api will return  the borrowed book  ",
        },
        {
          ApiName: "Borrowed History",
          url: BASE + "borrow/my-borrow-history",
          method: "GET",
          details: "this api will return all the borrowed and returned records",
        },
      ],
      reportAPI: [
        {
          ApiName: "Most Borrowed Books",
          url: BASE + "report/most-borrowed-books",
          method: "GET",
          details: "this api will return top 10 most borrowed books",
        },
        {
          ApiName: "Most Active Memebers",
          url: BASE + "report/most-active-members",
          method: "GET",
          query: [
            {
              key: "topmembers",
              default: 10,
              description: "those many top members",
            },
          ],
          details: "this api will return most active members",
        },
        {
          ApiName: "Book Availability",
          url: BASE + "report/book-availability",
          method: "GET",
          details: "this api will retrun all the books report",
        },
      ],
    },
    GraphQl: {
      linkUrl: req.protocol + "://" + req.get("host") + "/gqlserver",
      QueryRelated: {
        TestQuery: [
          {
            title: "Hello Check",
            query: `query Query {hello}`,
          },
        ],
        UserQuery: [
          {
            title: "Get Single User",
            query: `query Query { getSingleUser(id:"664f572986c102d352e18dc6") { message statusCode success data { _id name email role } } }`,
          },
          {
            title: "Get All Users",
            query: `query Query {GetAllUsers { message statusCode success data { _id email name password role } } }`,
          },
        ],
        BookQuery: [
          {
            title: "Get Single Book",
            query: `query Query { singleBook(id:"66503afed59b53ceb5e70904") { message statusCode success data { _id author isbn publication_date title copies genre createdAt } } }`,
          },
          {
            title: "Get All Books",
            query: `query Query { getBooksList(limit: 2, page: 1, genre: "Fiction") { TotalDocuments activePage dataLength statusCode success data { _id author title copies genre } } }`,
          },
        ],
      },
      MutationRelated: {
        MutationBook: [
          {
            title: "Add Booking ",
            query: `mutation Mutation { addNewBook( title: "Testing With GQL" author: "Stephen King3" publication_date: "1974-01-28" genre: "Horror" copies: 5 ) { data { _id title author copies genre isbn publication_date createdAt updatedAt } message statusCode success } }`,
          },
        ],
        MutationUser: [
          {
            title: "Add User ",
            query: `mutation Mutation { addNewUser(name: "Test12", email: "Test12@gmail.com" password: "Test@123") { message statusCode success data { _id email name role } } }`,
          },
        ],
      },
    },
    url: req.protocol + "://" + req.get("host") + req.originalUrl,
  });
};
