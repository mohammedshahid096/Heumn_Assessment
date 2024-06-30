const httpErrors = require("http-errors");
const { faker } = require("@faker-js/faker");
const {
  RegisterUserValidation,
  LoginUserValidation,
} = require("../JoiSchemas/user.validation");
const userModel = require("../Schema/user.model");
const {
  UserFailureConstants,
  UserSuccessConstants,
} = require("../Constants/user.constant");
const sendtokenMiddleware = require("../Middlewares/sendtoken.middleware");
const { VerifyPasswordMethod } = require("../Utils/verify.password");
const { GetSingleUserService } = require("../Services/user.service");
const logger = require("../Config/applogger.config");
const { VerifyRefreshToken, CreateAcessToken } = require("../Utils/jwt.token");

// register a new user controller
module.exports.RegisterUserController = async (req, res, next) => {
  try {
    logger.info("Controllers - User - Register - Start");
    let name = faker.person.fullName();
    let email = faker.internet.email({ firstName: name });
    let password = "Test@123";
    const body = { name, email, password };

    const { error } = RegisterUserValidation(body);
    if (error) {
      return next(httpErrors.BadRequest(error.details[0].message));
    }

    const isUserExist = await userModel.findOne({ email, password });
    if (isUserExist) {
      return next(httpErrors.NotFound(UserFailureConstants.USER_ALREADY_EXIST));
    }

    const newUser = new userModel(body);
    await newUser.save();

    res.status(200).json({
      success: true,
      message: UserSuccessConstants.NEW_USER_CREATED,
      data: newUser,
    });
  } catch (error) {
    logger.error("Controllers - User - Register - Error", {
      error: error.message,
    });
    next(httpErrors.InternalServerError(error.message));
  }
};

// login user
module.exports.LoginUserController = async (req, res, next) => {
  try {
    logger.info("Controllers - User - Login - Start");
    const { error } = LoginUserValidation(req.body);
    if (error) {
      return next(httpErrors.BadRequest(error.details[0].message));
    }

    const { email, password } = req.body;

    const userExist = await userModel.findOne({ email }).select("+password");
    if (!userExist) {
      return next(
        httpErrors.NotFound(UserFailureConstants.EMAIL_PASSWORD_INCORRECT)
      );
    }

    const isPasswordCorrect = await VerifyPasswordMethod(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      return next(
        httpErrors.NotFound(UserFailureConstants.EMAIL_PASSWORD_INCORRECT)
      );
    }

    delete userExist.password;

    sendtokenMiddleware(userExist, 200, res);
  } catch (error) {
    logger.error("Controllers - User - Login - Error", {
      error: error.message,
    });
    next(httpErrors.InternalServerError(error.message));
  }
};

// logout user
module.exports.LogoutUserController = async (req, res, next) => {
  try {
    logger.info("Controllers - User - Logout - Start");
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: UserSuccessConstants.LOGOUT_SUCCESS,
    });
  } catch (error) {
    logger.error("Controllers - User - Logout - Error", {
      error: error.message,
    });
    next(httpErrors.InternalServerError(error.message));
  }
};

// my profile
module.exports.MyAccountController = async (req, res, next) => {
  try {
    logger.info("Controllers - User - MyAccount - Start");
    const userDetails = await GetSingleUserService(req.userid);

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: userDetails,
    });
  } catch (error) {
    logger.error("Controllers - User - MyAccount - Error", {
      error: error.message,
    });
    next(httpErrors.InternalServerError(error.message));
  }
};

// generate aaccess token
module.exports.UpdateAccessTokenController = async (req, res, next) => {
  try {
    logger.info("Controllers - User - UpdateAccessToken - Start");
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return next(
        httpErrors.Unauthorized(UserFailureConstants.NOT_AUTHENTICATED)
      );
    }

    const decode = await VerifyRefreshToken(refresh_token);

    if (!decode.success) {
      return next(httpErrors.Unauthorized(decode.error.message));
    }

    let getUser = await userModel.findById(decode.id);
    if (!getUser) {
      return next(httpErrors.NotFound(UserFailureConstants.USER_NOT_FOUND));
    }

    const AccessToken = await CreateAcessToken(getUser._id, getUser.role);

    const AccessTokenOptions = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.ACCESS_TOKEN_KEY_TIME_COOKIE) * 60 * 1000
      ), // for min
      sameSite: "none",
      secure: true,
      httpOnly: true,
      // maxAge: parseInt(process.env.COOKIE_MAX_TIME),
    };

    res.cookie("access_token", AccessToken, AccessTokenOptions);
    res.status(200).json({
      success: true,
      AccessToken,
    });
  } catch (error) {
    logger.error("Controllers - User - UpdateAccessToken - Error", {
      error: error.message,
    });
    next(httpErrors.InternalServerError(error.message));
  }
};

// update user role
module.exports.UpdateUserRoleController = async (req, res, next) => {
  try {
    logger.info("Controllers - User - UpdateUserRole - Start");
    const { userid } = req.params;
    const { role } = req.body;
    if (!role) {
      return next(httpErrors.BadRequest("Enter the role"));
    }
    const data = await userModel.findByIdAndUpdate(userid, { role });
    if (!data) {
      return next(httpErrors.NotFound(UserFailureConstants.USER_NOT_FOUND));
    }
    res.status(200).json({
      success: true,
      message: "successfully updated the role",
    });
  } catch (error) {
    logger.error("Controllers - User - UpdateUserRole - Error", {
      error: error.message,
    });
    next(httpErrors.InternalServerError(error.message));
  }
};
