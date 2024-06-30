const logger = require("../Config/applogger.config");
const httpErrors = require("http-errors");
const taskModel = require("../Schema/task.model");
const assignedModel = require("../Schema/taskuser.model");
const statusModel = require("../Schema/status.model");
const ROLES = require("../Constants/roles.constant");
const moment = require("moment");
const dependencyModel = require("../Schema/dependency.model");
const versionModel = require("../Schema/version.model");
const dependencyCheck = require("../Utils/dependency.check");

//  Adding a Task controller
module.exports.AddAssignTaskController = async (root, args, context, info) => {
  try {
    logger.info("Controller - Assign - AddAssignTaskController - Start");
    const { role, userid } = context;
    const { taskId, userId, leadTaskId } = args;

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
    }

    const isAlreadyAssigned = await assignedModel.findOne({
      taskId,
      userId,
    });
    if (isAlreadyAssigned) {
      return httpErrors.BadRequest(TaskFailureConstants.ALREADY_TASK_ASSIGNED);
    }

    const statusData = new statusModel({ updatedBy: userid });
    await statusData.save();

    const body = {
      taskId,
      userId,
      statusId: statusData._id,
    };

    const data = new assignedModel(body);
    await data.save();
    return data;
  } catch (error) {
    logger.info("Controller - Assign - AddAssignTaskController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};

module.exports.UpdateTaskStatusController = async (
  root,
  args,
  context,
  info
) => {
  try {
    logger.info("Controller - Assign - UpdateTaskStatusController - Start");
    const { role, userid } = context;
    const { assignedId, status, userId, leadProjectId } = args;

    const oldUserTask = await assignedModel.findById(assignedId);

    if (!oldUserTask) {
      return httpErrors.NotFound();
    }

    const isReadyToUpdate = await dependencyCheck(oldUserTask.taskId);

    if (!isReadyToUpdate) {
      throw new Error("please tell all users to complete parent tasks");
    }

    //  if role is lead then will check weather lead project is assigned or not
    if (role === ROLES.TEAM_LEAD) {
      if (!leadProjectId) {
        return httpErrors.BadRequest("Enter the Lead Task ID");
      }

      const checkIsExist = await assignedModel.findOne({
        taskId: leadProjectId,
        userId: userid,
      });
      if (!checkIsExist) {
        return httpErrors.Unauthorized(
          "Unauthorized to add task in the given lead task"
        );
      }
    } else if (role === ROLES.MEMBER) {
      const isAssigned = oldUserTask.userId.toString() === userid.toString();
      if (!isAssigned) {
        return httpErrors.NotFound("Cannot find the task");
      }
    }

    const newStatus = await statusModel.create({
      status: status,
      updatedBy: userid,
    });

    const versionDetails = {
      taskId: oldUserTask.taskId,
      statusId: oldUserTask.statusId,
      userId: userId ? userId : userid,
      updatedBy: userid,
    };
    oldUserTask.statusId = newStatus._id;
    oldUserTask.save();
    const addVersion = await new versionModel(versionDetails).save();

    return {
      userTask: oldUserTask,
      version: addVersion,
    };
  } catch (error) {
    logger.info("Controller - Assign - AddAssignTaskController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};

// ---------------- QUERY RELATED CONTROLLERS ---------------------
module.exports.GetSingleTaskDetailController = async (
  root,
  args,
  context,
  info
) => {
  try {
    logger.info("Controller - Assign - GetSingleTaskDetail - Start");
    const { role, userid } = context;
    const { taskId } = args;

    let TaskDetail = null;
    let SubTasks = null;
    let Dependencies = null;
    let MainTaskId = null;
    let SubTaskquery = {};

    if (role === ROLES.ADMIN_ROLE || role === ROLES.MANAGER_ROLE) {
      MainTaskId = taskId;
      SubTaskquery.parentTaskId = taskId;
    } else if (role === ROLES.TEAM_LEAD) {
      const checkIsExist = await assignedModel.findOne({
        taskId,
        userId: userid,
      });
      if (!checkIsExist) {
        return httpErrors.Unauthorized(
          "Unauthorized to add task in the given lead task"
        );
      }
      MainTaskId = taskId;
      SubTaskquery.parentTaskId = taskId;
    } else if (role === ROLES.MEMBER) {
      console.log("cjekckjj");
      const checkIsExist = await assignedModel.findOne({
        taskId,
        userId: userid,
      });
      if (!checkIsExist) {
        return httpErrors.Unauthorized(
          "Unauthorized to add task in the given lead task"
        );
      }
      MainTaskId = checkIsExist.parentTaskId
        ? checkIsExist.parentTaskId
        : taskId;

      const taskIds = await assignedModel
        .find({ userId: userid })
        .populate("taskId", "parentTaskId")
        .select("taskId");
      console.log(taskIds);

      let temp = taskIds.filter((item) => {
        if (item.taskId?.parentTaskId === taskId) {
          return item.taskId.toString();
        }
      });

      // console.log(temp);
      // let getSubTaskIds = await taskModel
      //   .find({ parentTaskId: taskId })
      //   .select("_id");

      // let getSubTaskIds2 = getSubTaskIds.map((item) => item._id.toString());

      SubTaskquery._id = { $in: temp };
    }
    TaskDetail = await taskModel.findById(MainTaskId);
    console.log(SubTaskquery);
    SubTasks = await taskModel.find(SubTaskquery);
    Dependencies = await dependencyModel.find({ taskId });
    return {
      TaskDetail,
      SubTasks,
      Dependencies,
    };
  } catch (error) {
    logger.info("Controller - Assign - GetSingleTaskDetail - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};

module.exports.GetFilterTasksController = async (root, args, context, info) => {
  try {
    logger.info("Controller - Assign - GetFilterTasksController - Start");
    const { role, userid } = context;
    const { status, dueDate, name } = args;

    const aggregation = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetail",
        },
      },
      {
        $unwind: "$userDetail",
      },
      {
        $lookup: {
          from: "tasks",
          localField: "taskId",
          foreignField: "_id",
          as: "taskDetail",
        },
      },
      {
        $unwind: "$taskDetail",
      },
      {
        $lookup: {
          from: "status",
          localField: "statusId",
          foreignField: "_id",
          as: "statusDetail",
        },
      },
      {
        $unwind: "$statusDetail",
      },
      {
        $project: {
          _id: 0,
          name: "$userDetail.name",
          userid: "$userDetail._id",
          taskId: "$taskDetail._id",
          taskName: "$taskDetail.title",
          parentTaskId: "$taskDetail.parentTaskId",
          dueDate: "$taskDetail.dueDate",
          status: "$statusDetail.status",
        },
      },
    ];

    const matchQuery = {};
    if (role === ROLES.TEAM_LEAD || role === ROLES.MEMBER)
      matchQuery.userid = userid;
    if (status) matchQuery.status = status;
    if (name) matchQuery.name = { $regex: name, $options: "i" };
    if (dueDate)
      matchQuery.dueDate = {
        $gte: moment().format(), // today's date
        $lte: moment(dueDate, "DD/MM/YYYY").format(), // end date
      };

    aggregation.push({ $match: matchQuery });

    const data = await assignedModel.aggregate(aggregation);
    return data;
  } catch (error) {
    logger.info("Controller - Assign - GetFilterTasksController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};

module.exports.GetUserDetailAssignTasksController = async (
  root,
  args,
  context,
  info
) => {
  try {
    logger.info(
      "Controller - Assign - GetUserDetailAssignTasksController - Start"
    );
    const { role, userid } = context;

    const aggregation = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetail",
        },
      },
      {
        $unwind: "$userDetail",
      },
      {
        $lookup: {
          from: "tasks",
          localField: "taskId",
          foreignField: "_id",
          as: "taskDetail",
        },
      },
      {
        $unwind: "$taskDetail",
      },
      {
        $project: {
          _id: 0,
          name: "$userDetail.name",
          email: "$userDetail.email",
          userid: "$userDetail._id",
          taskDetail: 1,
        },
      },
      {
        $group: {
          _id: "$userid",
          name: { $first: "$name" },
          email: { $first: "$email" },
          userid: { $first: "$userid" },
          tasks: { $push: "$taskDetail" },
        },
      },
    ];
    const data = await assignedModel.aggregate(aggregation);
    return data;
  } catch (error) {
    logger.info(
      "Controller - Assign - GetUserDetailAssignTasksController - Error",
      {
        error: error.message,
      }
    );
    return httpErrors.InternalServerError(error.message);
  }
};
