const logger = require("../Config/applogger.config");
const httpErrors = require("http-errors");
const dependencyModel = require("../Schema/dependency.model");

//  Adding a Dependency controller
module.exports.AddDependencyController = async (root, args, context, info) => {
  try {
    logger.info("Controller - Dependency - AddDependencyController - Start");
    const { taskId, dependentTaskId } = args;

    if (taskId === dependentTaskId) {
      return httpErrors.UnprocessableEntity(
        "Task and Dependent task should not be same"
      );
    }

    const isAlreadyExist = await dependencyModel.findOne({
      taskId,
      dependentTaskId,
    });

    if (isAlreadyExist) {
      return httpErrors.BadRequest("Already Dependency is Added");
    }

    const data = await dependencyModel.create({
      taskId,
      dependentTaskId,
    });

    return data;
  } catch (error) {
    logger.info("Controller - Dependency - AddDependencyController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};

//  Deleting a Dependency controller
module.exports.DeleteDependencyController = async (req, res, next) => {
  try {
    logger.info("Controller - Dependency - AddDependencyController - Start");
    const { dependencyId } = req.params;
    const data = await dependencyModel.findByIdAndDelete(dependencyId);
    if (!data) {
      return httpErrors.NotFound();
    }
    return data;
  } catch (error) {
    logger.info("Controller - Dependency - AddDependencyController - Error", {
      error: error.message,
    });
    return httpErrors.InternalServerError(error.message);
  }
};
