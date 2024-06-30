const logger = require("../Config/applogger.config");
const httpErrors = require("http-errors");
const taskModel = require("../Schema/task.model");
const moment = require("moment");
const assignedModel = require("../Schema/taskuser.model");
const ROLES = require("../Constants/roles.constant");
const { DeleteAllTaskService } = require("../Services/task.service");
const {
  DeleteManyVersionService,
  DeleteStatusByIdService,
} = require("../Services/status.service");

//  Adding a Task controller
module.exports.AddTaskController = async (root, args, context, info) => {
  try {
    logger.info("Controller - Task - AddTaskController - Start");
    const { role, userid } = context;
    const { title, dueDate, parentId, description } = args;

    const body = {
      title,
      createdBy: userid,
      dueDate: moment(dueDate, "DD/MM/YYYY").format(),
    };

    if (parentId) {
      body.parentTaskId = parentId;
    }
    if (description) {
      body.description = description;
    }

    //  if role is lead then will check weather lead project is assigned or not
    if (role === ROLES.TEAM_LEAD) {
      if (!parentId) {
        return httpErrors.BadRequest("Enter the Lead Task ID");
      }

      const checkIsExist = await assignedModel.findOne({
        taskId: parentId,
        userId: userid,
      });
      if (!checkIsExist) {
        return httpErrors.Unauthorized(
          "Unauthorized to add task in the given lead task"
        );
      }
    }

    const data = new taskModel(body);
    await data.save();

    return data;
  } catch (error) {
    logger.info("Controller - Task - AddTaskController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};

// Updating a Task Details
module.exports.UpdateTaskDetailController = async (
  root,
  args,
  context,
  info
) => {
  try {
    logger.info("Controller - Task - UpdateTaskController - Start");
    const { role, userid } = context;
    const { title, dueDate, description, leadTaskId } = args;
    let taskId = args.taskid;

    const body = {};

    if (title) body.title = title;
    if (description) body.description = description;
    if (dueDate) body.dueDate = moment(dueDate, "DD/MM/YYYY").format();

    //  if role is lead then will check weather lead project is assigned or not
    if (role === ROLES.TEAM_LEAD) {
      if (!leadTaskId) {
        return httpErrors.BadRequest("Enter the Lead Task ID");
      }

      const checkIsExist = await assignedModel.findOne({
        taskId: leadTaskId,
        userId: userid,
      });
      if (!checkIsExist) {
        return httpErrors.Unauthorized(
          "Unauthorized to add task in the given lead task"
        );
      }
      taskId = leadTaskId;
    }

    const data = await taskModel.findByIdAndUpdate(taskId, body, { new: true });
    if (!data) {
      return httpErrors.NotFound("task not found");
    }
    return data;
  } catch (error) {
    logger.info("Controller - Task - UpdateTaskController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};

// Deleting a Task overall
module.exports.DeleteTaskController = async (root, args, context, info) => {
  try {
    logger.info("Controller - Task - DeleteTaskController - Start");
    const { taskid } = args;

    const isTaskExist = await taskModel.findById(taskid);
    if (!isTaskExist) {
      return httpErrors.NotFound("Task Not Found");
    }
    const isHavingDepedentcy = await taskModel.findOne({
      dependentTaskId: taskid,
    });
    if (isHavingDepedentcy) {
      return httpErrors.BadRequest(
        "Cannot Delete this Project as other project is Dependent to this"
      );
    }

    logger.info(
      "Controller - Task - DeleteTaskController - DeleteTask - Delete Task"
    );
    const tasksIds = await DeleteAllTaskService(taskid);

    await taskModel.findByIdAndDelete(taskid);
    logger.info(
      "Controller - Task - DeleteTaskController  - DeleteTask - Delete Assigned"
    );

    await assignedModel.deleteMany({ taskId: { $in: tasksIds } });

    logger.info(
      "Controller - Task - DeleteTaskController - DeleteTask - Delete Versions"
    );
    const versionsData = await DeleteManyVersionService(tasksIds);
    console.log(versionsData, "versions");
    for (let i = 0; i < versionsData.length; i++) {
      await DeleteStatusByIdService(versionsData[i]);
    }

    return {
      success: true,
      message: "successfully task is deleted",
    };
  } catch (error) {
    logger.info("Controller - Task - DeleteTaskController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};
