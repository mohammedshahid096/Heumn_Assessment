const TestTypeDef = require("./test.typedef");
const TaskTypeDef = require("./task.typedef");
const gql = require("graphql-tag");

module.exports = gql`
  ${TestTypeDef}
  ${TaskTypeDef}
`;
