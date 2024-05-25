const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const MongoDataBaseConn = require("./Config/mongodb.config");
const IndexRoutes = require("./Routes/index.routes");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const typeDefs = require("./GraphQl/typeDefs");
const resolvers = require("./GraphQl/resolvers");
const overviewController = require("./Controllers/overview.controller");

async function init() {
  const app = express();

  // env config
  dotenv.config();

  // connecting to db
  MongoDataBaseConn();

  // using  parsing dependencies
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  // cors config

  app.use(
    cors({
      origin: JSON.parse(process.env.ALLOW_ORIGINS_ACCESS),
      credentials: true,
    })
  );

  // creating appologql server
  const GqlServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // strating gqlserver
  await GqlServer.start();

  app.get("/", overviewController);

  app.use("/gqlserver", expressMiddleware(GqlServer));

  // indexroute
  app.use("/api/v1/", IndexRoutes);

  // if no routes findout
  app.use("*", (req, res) => {
    res.status(500).json({
      success: false,
      statusCode: 500,
      url: req.baseUrl,
      type: req.method,
      message: "API not found",
    });
  });

  // response for error message
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      success: false,
      statusCode: err.status || 500,
      message: err.message || "internal server error",
      stack: err.stack || "not present",
    });
  });

  // server listening
  app.listen(process.env.PORT || 8001, () => {
    console.log(`MODE : ${process.env.DEVELOPMENT_MODE}`);
    console.log(
      "server is running on:  http://localhost:" + process.env.PORT || 8001
    );
  });
}

init();
