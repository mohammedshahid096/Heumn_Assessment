const userModel = require("../Schema/user.model");

/**
 * getting a single user detail data
 * @param {String} userid user mongodb object id
 * @return {Object} user details
 */
module.exports.GetSingleUserService = async (userid) => {
  let data = await userModel.findById(userid);
  return data;
};
