const dependencyModel = require("../Schema/dependency.model");
const statusModel = require("../Schema/status.model");
const versionModel = require("../Schema/version.model");

module.exports.CreateNewStatusService = async (details) => {
  const data = new statusModel(details);
  await data.save();
  return data;
};

module.exports.DeleteStatusByIdService = async (id) => {
  const data = await statusModel.findByIdAndDelete(id);
  return data;
};

// --------------------------------------
// ?--------------VERSION----------------
// --------------------------------------

module.exports.CreateNewVersionService = async (details) => {
  const data = new versionModel(details);
  await data.save();
  return data;
};

module.exports.FindOneVersionService = async (query) => {
  const data = await versionModel.findOne(query);
  return data;
};

module.exports.FindByIdVersionService = async (id) => {
  const data = await versionModel.findById(id);
  return data;
};

module.exports.DeleteManyVersionService = async (taskids) => {
  const data = await versionModel
    .find({ taskId: { $in: taskids } })
    .select("statusId");
  await versionModel.deleteMany({ taskId: { $in: taskids } });
  const ids = data.map((item) => item.statusId.toString());
  return ids;
};
// --------------------------------------
// ?--------------DEPENDENCY-------------
// --------------------------------------
module.exports.CreateNewDependencyService = async (details) => {
  const data = new dependencyModel(details);
  await data.save();
  return data;
};

module.exports.FindOneDependencyService = async (query) => {
  const data = await dependencyModel.findOne(query);
  return data;
};
module.exports.FindAllDependencyService = async (query) => {
  const data = await dependencyModel
    .find(query)
    .populate("dependentTaskId", "title");
  return data;
};

module.exports.FindByIdDependencyService = async (id) => {
  const data = await dependencyModel.findById(id);
  return data;
};
