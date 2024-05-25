const httpErrors = require("http-errors");
const { errorConstant } = require("../Utils/constants");
const { VerifyAccessToken } = require("../Utils/jwt.token");
const {
  ACCESS_KEY,
  REFRESH_KEY,
  HEUMN_USER_KEY,
} = require("../Utils/TokenConstants");
const userModel = require("../Models/user.model");

// for authentication
module.exports.Authentication = async (req, res, next) => {
  try {
    const { access_token, refresh_token } = req.cookies;
    if (!refresh_token) {
      return next(
        httpErrors.Unauthorized(errorConstant.NOT_FOUND_REFRESH_TOKEN)
      );
    }
    if (!access_token) {
      return next(httpErrors.Unauthorized(errorConstant.NOT_AUTHENTICATED));
    }

    const decode = await VerifyAccessToken(access_token);
    if (!decode.success) {
      res.clearCookie(ACCESS_KEY);
      res.clearCookie(REFRESH_KEY);
      res.clearCookie(HEUMN_USER_KEY);
      return next(httpErrors.Unauthorized(decode.error.message));
    }

    let user = await userModel.findById(decode?.id);
    if (!user) {
      res.clearCookie(ACCESS_KEY);
      res.clearCookie(REFRESH_KEY);
      res.clearCookie(HEUMN_USER_KEY);
      return next(httpErrors.Unauthorized(decode.error.message));
    }

    req.userid = user?._id;
    req.role = user?.role;
    req.name = user?.name;

    console.log(`req => name: ${user?.email} role:${user?.role}`);
    next();
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// authorization depending  upon a role
module.exports.Authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      res.clearCookie(ACCESS_KEY);
      res.clearCookie(REFRESH_KEY);
      res.clearCookie(HEUMN_USER_KEY);
      return next(httpErrors.Unauthorized(errorConstant.NOT_AUTHORIZED));
    }
    next();
  };
};
