const httpErrors = require("http-errors");
const { VerifyAccessToken } = require("../Utils/jwt.token");
const { UserFailureConstants } = require("../Constants/user.constant");
const { GetSingleUserService } = require("../Services/user.service");
const logger = require("../Config/applogger.config");

// for authentication
module.exports.Authentication = async (req, res, next) => {
  try {
    logger.info("Middleware - Authentication - Start ");
    const { access_token, refresh_token } = req.cookies;
    if (!access_token) {
      return next(
        httpErrors.Unauthorized(UserFailureConstants.NOT_AUTHENTICATED)
      );
    }

    const decode = await VerifyAccessToken(access_token);
    if (!decode.success) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return next(httpErrors.Unauthorized(decode.error.message));
    }

    let user = await GetSingleUserService(decode.id);
    if (!user) {
      return next(httpErrors.NotFound(UserFailureConstants.USER_NOT_FOUND));
    }
    req.userid = user?._id;
    req.name = user?.name;
    req.role = user?.role;

    console.log(`req name: ${user.email} Id:${user._id} Role : ${user.role}`);
    logger.info("Middleware - Authentication - End ", {
      details: { userid: user.id, role: user.role, name: user.name },
    });

    next();
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// // authorization depending  upon a role
module.exports.Authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return next(httpErrors.Unauthorized(UserFailureConstants.NOT_AUTHORIZED));
    }
    next();
  };
};

// Authorisation upon a role
module.exports.GraphqlAuthorisationMiddleWare =
  (...roles) =>
  (next) => {
    return (root, args, context, info) => {
      if (!roles.includes(context.role)) {
        throw new Error(`You do not Access to use this resources`);
      }
      return next(root, args, context, info);
    };
  };
