const assignedModel = require("../Schema/taskuser.model");

module.exports.CreateNewAssignedService = async (details) => {
  const data = new assignedModel(details);
  await data.save();
  return data;
};

module.exports.FindOneAssignedService = async (query) => {
  const data = await assignedModel.findOne(query);
  return data;
};

module.exports.FindByIdAssignedService = async (id) => {
  const data = await assignedModel.findById(id);
  return data;
};

module.exports.UpdateAssignedService = async (id, details) => {
  const data = await assignedModel.findByIdAndUpdate(id, details, {
    new: true,
  });
  return data;
};

module.exports.DeleteAssignedManyService = async (IdsArray) => {
  await assignedModel.deleteMany({ taskId: { $in: IdsArray } });
};
