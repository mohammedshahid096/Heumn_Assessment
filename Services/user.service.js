const userModel = require("../Models/user.model");
const { errorConstant, successConstant } = require("../Utils/constants");

module.exports.GetAllUserService = async () => {
  let data = await userModel.find();
  return {
    success: true,
    statusCode: 200,
    message: "all users",
    data,
  };
};

module.exports.GetSingleUserService = async (_, args) => {
  try {
    const { id } = args;
    const data = await userModel.findById(id);
    if (!data)
      return {
        success: false,
        statusCode: 404,
        message: errorConstant.USER_NOT_FOUND,
      };

    return {
      success: true,
      statusCode: 200,
      message: "single user details",
      data,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.AddNewUserService = async (_, details) => {
  try {
    const userExist = await userModel.findOne({ email: details.email });
    if (userExist) {
      return {
        success: false,
        statusCode: 400,
        message: errorConstant.EMAIL_EXIST,
      };
    }

    const newUser = new userModel(details);
    await newUser.save();

    return {
      success: true,
      statusCode: 201,
      message: successConstant.NEW_USER_CREATED,
      data: newUser,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
