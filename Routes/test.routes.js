const express = require("express");
const httpErrors = require("http-errors");
const assignedModel = require("../Schema/taskuser.model");
const taskModel = require("../Schema/task.model");
const userModel = require("../Schema/user.model");
const versionModel = require("../Schema/version.model");
const { faker } = require("@faker-js/faker");
const moment = require("moment");

const TestRoutes = express.Router();

TestRoutes.route("/usertasks").get(async (req, res, next) => {
  try {
    const data = await assignedModel
      .find()
      .populate("taskId", "title")
      .populate("userId", "name")
      .populate("statusId", "status");
    res.status(200).json(data);
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
});

TestRoutes.route("/tasks").get(async (req, res, next) => {
  try {
    const data = await taskModel.find();
    res.status(200).json(data);
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
});

TestRoutes.route("/users").get(async (req, res, next) => {
  try {
    const data = await userModel.find();
    res.status(200).json(data);
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
});

TestRoutes.route("/versions").get(async (req, res, next) => {
  try {
    const data = await versionModel
      .find()
      .populate("taskId", "title")
      .populate("userId", "name")
      .populate("statusId", "status");
    res.status(200).json(data);
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
});

TestRoutes.route("/create-task").get(async (req, res, next) => {
  try {
    const { count = 1 } = req.query;
    const data = [];
    for (let i = 0; i < Number(count); i++) {
      const Tempdata = await new taskModel({
        title: faker.lorem.lines(1),
        description: faker.lorem.paragraph(1),
        dueDate: moment(faker.date.anytime()).format(),
        createdBy: "667564bea66ab43472f39c53",
      }).save();

      const data2 = Tempdata.toObject({ lean: true });
      data.push(data2);
    }
    res.status(200).json(data);
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
});

TestRoutes.route("/create-task").get(async (req, res, next) => {
  try {
    const { count = 1 } = req.query;
    const data = [];
    for (let i = 0; i < Number(count); i++) {
      const Tempdata = await new taskModel({
        title: faker.lorem.lines(1),
        description: faker.lorem.paragraph(1),
        dueDate: moment(faker.date.anytime()).format(),
        createdBy: "667564bea66ab43472f39c53",
        parentTaskId: "",
      }).save();

      const data2 = Tempdata.toObject({ lean: true });
      data.push(data2);
    }
    res.status(200).json(data);
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
});

module.exports = TestRoutes;
