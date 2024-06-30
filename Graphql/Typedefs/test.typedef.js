const gql = require("graphql-tag");

const TestTypeDef = gql`
  scalar timestamptz

  type Query {
    hello: String
  }

  type User {
    name: String
    email: String
    password: String
    role: String
    createdAt: timestamptz
    updatedAt: timestamptz
  }
`;

module.exports = TestTypeDef;
