const express = require("express");
const UserRoutes = require("./user.routes");
const TestRoutes = require("./test.routes");

const IndexRoutes = express.Router();

IndexRoutes.use("/user", UserRoutes);
IndexRoutes.use("/test", TestRoutes);

module.exports = IndexRoutes;
