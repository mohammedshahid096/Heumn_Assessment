const typeDefs = `
scalar timestamptz

type Query{
  hello:String

  getSingleUser(id:ID!) :SingleUserResponse
  GetAllUsers :AllUserResponse

  singleBook(id:ID!): SingleBookResponse
  getBooksList(limit: Int, page: Int, genre: String, author: String): BooksListResponse
}

type Mutation{
    addNewUser(name:String!,email:String!,password:String!): SingleUserResponse 

    addNewBook(title:String!,author:String!,publication_date:String!,genre:String!,copies:Int!): SingleBookResponse 
}


type User{
    _id:ID,
    name :String,
    email :String,
    password:String,
    role:String,
    createdAt: timestamptz
    updatedAt: timestamptz
}

type Book {
  _id: ID!
  title: String
  author: String
  isbn:String
  publication_date:String
  genre: String
  copies:Int
  createdAt: timestamptz
  updatedAt: timestamptz
}


type SimpleResponse{
    success:Boolean
    statusCode :Int
    message :String
}



type SingleUserResponse{
    success:Boolean
    statusCode :Int
    data : User
    message :String
}
type AllUserResponse{
    success:Boolean
    statusCode :Int
    data : [User]
    message :String
}



type SingleBookResponse{
    success:Boolean
    statusCode :Int
    data : Book
    message :String
}

type BooksListResponse {
    success: Boolean
    statusCode: Int
    data: [Book]
    TotalDocuments: Int
    activePage: Int
    dataLength: Int
  }
`;

module.exports = typeDefs;
