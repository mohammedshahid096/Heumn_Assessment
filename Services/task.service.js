const taskModel = require("../Schema/task.model");

module.exports.GetSingleTaskService = async (taskid) => {
  const data = await taskModel.findById(taskid).populate("createdBy", "name");
  return data;
};

module.exports.GetSingleTaskQueryService = async (query) => {
  const data = await taskModel.findOne(query);
  return data;
};

module.exports.GetAllTaskByQuery = async (query) => {
  const data = await taskModel.find(query);
  return data;
};

module.exports.AddNewTaskService = async (details) => {
  const data = new taskModel(details);
  await data.save();
  return data;
};

module.exports.UpdateTaskDetailsById = async (taskid, details) => {
  const data = await taskModel.findByIdAndUpdate(taskid, details, {
    new: true,
  });
  return data;
};

module.exports.DeleteTaskService = async (taskid) => {
  const data = await taskModel.findByIdAndDelete(taskid);
  return data;
};

module.exports.DeleteAllTaskService = async (taskid) => {
  const data = await taskModel
    .find({
      $or: [{ _id: taskid }, { parentTaskId: taskid }],
    })
    .select("_id");

  await taskModel.deleteMany({
    $or: [{ _id: taskid }, { parentTask: taskid }],
  });
  const ids = data.map((item) => item._id.toString());
  return ids;
};
