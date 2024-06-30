const logger = require("../Config/applogger.config");
const dependencyModel = require("../Schema/dependency.model");
const taskModel = require("../Schema/task.model");
const assignedModel = require("../Schema/taskuser.model");

async function GetUsersStatus(taskid) {
  logger.info("Utils -  Dependency Check - GetUserStatus - Start");
  const allwithSubTasksID = await taskModel
    .find({
      $or: [{ _id: taskid }, { parentTaskId: taskid }],
    })
    .select("_id");

  const resultsUserTaskID = allwithSubTasksID.map((item) =>
    item._id.toString()
  );
  console.log(resultsUserTaskID);

  const data = await assignedModel
    .find({ taskId: { $in: resultsUserTaskID } })
    .populate("statusId", "status");
  const arrayStatus = data.map((item) => item.statusId.status);
  return arrayStatus;
}

module.exports = async (taskid) => {
  logger.info("Utils -  Dependency Check - Main - Start");
  const data = await dependencyModel.find({ taskId: taskid });
  if (data.length === 0) {
    return true;
  }
  let AllStatusArray = [];
  for (let i = 0; i < data.length; i++) {
    const results = await GetUsersStatus(data[i].dependentTaskId);
    console.log(results, i);
    AllStatusArray = [...AllStatusArray, ...results];
  }
  let CanUpdate = AllStatusArray.every((item) => item === "completed");
  console.log(CanUpdate);
  return CanUpdate;
};
