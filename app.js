const express = require("express");
const dotenv = require("dotenv");
const MongoDataBaseConn = require("./Config/db.config");
const IndexRoutes = require("./Routes/Index.route");
const cookieParser = require("cookie-parser");
const {
  CreateAppoloGraphqlServerFunction,
  GqlServer,
} = require("./Graphql/index.grahphql");
const { expressMiddleware } = require("@apollo/server/express4");
const { Authentication } = require("./Middlewares/auth.middleware");
const { rateLimit } = require("express-rate-limit");

async function __init__() {
  const app = express();
  //   env load
  dotenv.config();

  //   mongodb connection
  MongoDataBaseConn();
  await CreateAppoloGraphqlServerFunction();

  const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 150,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  });

  app.use(limiter);

  //   all configs
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome Message",
    });
  });

  app.use("/api/v1", IndexRoutes);
  app.use(
    "/gqlserver",
    Authentication,
    expressMiddleware(GqlServer, {
      context: ({ req }) => ({
        userid: req.userid,
        name: req.name,
        role: req.role,
      }),
    })
  );
  app.use("/testgql", expressMiddleware(GqlServer));

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

  //   server  is listening
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log("servser is connected on http://localhost:" + port);
  });
}

__init__();
