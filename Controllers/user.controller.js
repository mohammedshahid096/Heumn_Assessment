const httpErrors = require("http-errors");
const {
  RegisterUserValidation,
  LoginUserValidation,
  UpdatePasswordValidation,
} = require("../JoiSchemas/user.schema");
const userModel = require("../Models/user.model");
const { errorConstant, successConstant } = require("../Utils/constants");
const { VerifyRefreshToken, CreateAcessToken } = require("../Utils/jwt.token");
const { VerifyPasswordMethod } = require("../Middlewares/usermodel.methods");
const SendToken = require("../Middlewares/SendToken");
const {
  ACCESS_KEY,
  HEUMN_USER_KEY,
  REFRESH_KEY,
} = require("../Utils/TokenConstants");

// creating a user controller
module.exports.CreateUserController = async (req, res, next) => {
  try {
    const { error } = RegisterUserValidation(req.body);
    if (error) {
      return next(httpErrors.BadRequest(error.details[0].message));
    }

    const { email } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return next(httpErrors.BadRequest(errorConstant.EMAIL_EXIST));
    }

    const newUser = new userModel(req.body);
    await newUser.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: successConstant.NEW_USER_CREATED,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// login user controller
module.exports.LoginUserController = async (req, res, next) => {
  try {
    const { error } = LoginUserValidation(req.body);
    if (error) {
      return next(httpErrors.BadRequest(error.details[0].message));
    }

    const { email, password } = req.body;

    const userExist = await userModel.findOne({ email }).select("+password");
    if (!userExist) {
      return next(httpErrors.NotFound(errorConstant.EMAIL_NOT_FOUND));
    }

    const isPasswordCorrect = await VerifyPasswordMethod(
      password,
      userExist.password
    );
    if (!isPasswordCorrect) {
      return next(httpErrors.NotFound(errorConstant.EMAIL_NOT_FOUND));
    }

    SendToken(userExist, 200, res);
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// logout user
module.exports.LogoutUserController = async (req, res, next) => {
  try {
    res.clearCookie(ACCESS_KEY);
    res.clearCookie(REFRESH_KEY);
    res.clearCookie(HEUMN_USER_KEY);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: successConstant.LOGOUT,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// generating a new Access Token
module.exports.GenerateAccessTokenController = async (req, res, next) => {
  try {
    const { refresh_token, access_token, heumn_user_token } = req.cookies;

    if (!refresh_token) {
      if (access_token) {
        res.clearCookie(ACCESS_KEY);
      }
      if (heumn_user_token) {
        res.clearCookie(HEUMN_USER_KEY);
      }
      return next(
        httpErrors.Unauthorized(errorConstant.NOT_FOUND_REFRESH_TOKEN)
      );
    }

    const decode = await VerifyRefreshToken(refresh_token);

    if (!decode.success) {
      return next(httpErrors.Unauthorized(decode.error.message));
    }

    let userExist = await userModel.findById(decode.id);
    if (!userExist) {
      return next(httpErrors.NotFound(errorConstant.EMAIL_NOT_FOUND));
    }

    const AccessToken = await CreateAcessToken(userExist._id, userExist.role);
    console.log(AccessToken);

    const AccessTokenOptions = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.ACCESS_TOKEN_KEY_TIME_COOKIE) * 60 * 1000
      ),
      sameSite: "none",
      secure: true,
      httpOnly: true,
    };

    res.cookie(ACCESS_KEY, AccessToken, AccessTokenOptions);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "A new Access Token is Genrated",
      AccessToken,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// my profile
module.exports.MyAccountController = async (req, res, next) => {
  try {
    const userDetails = await userModel.findById(req.userid);
    if (!userDetails) {
      return next(httpErrors.NotFound(errorConstant.USER_NOT_FOUND));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: userDetails,
    });
  } catch (error) {
    next(httpErrors.InternalServerError(error.message));
  }
};

// updating the password
module.exports.UpdatePasswordController = async (req, res, next) => {
  const { error } = UpdatePasswordValidation(req.body);
  if (error) {
    return next(httpErrors.BadRequest(error.details[0].message));
  }

  const { old_password, new_password } = req.body;
  const user = await userModel.findById(req.userid).select("+password");

  if (!user) {
    return next(httpErrors.NotFound(errorConstant.USER_NOT_FOUND));
  }

  const isPasswordMatch = await VerifyPasswordMethod(
    old_password,
    user.password
  );
  if (!isPasswordMatch) {
    return next(httpErrors.BadRequest(errorConstant.PASSWORD_NOT_MATCH));
  }

  if (old_password === new_password) {
    return next(httpErrors.BadRequest(errorConstant.OLD_NEW_PASSWORD_SAME));
  }

  user.password = new_password;
  await user.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: successConstant.PASSWORD_UPDATED,
  });
};
