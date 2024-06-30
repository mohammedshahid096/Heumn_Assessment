const { ApolloServer } = require("@apollo/server");
const logger = require("../Config/applogger.config");
const indexTypedef = require("./Typedefs/index.typedef");
const indexResolver = require("./Resolvers/index.resolver");

const GqlServer = new ApolloServer({
  typeDefs: indexTypedef,
  resolvers: indexResolver,
});

async function CreateAppoloGraphqlServerFunction() {
  try {
    logger.info("Graphql - Index - CreateServer - Start");
    //starting the gql server
    await GqlServer.start();
  } catch (error) {
    logger.error("Graphql - Index - CreateServer - Start", { error });
  }
}

module.exports = {
  CreateAppoloGraphqlServerFunction,
  GqlServer,
};
