const {
  ACCESS_KEY,
  REFRESH_KEY,
  HEUMN_USER_KEY,
} = require("../Utils/TokenConstants");
const { CreateAcessToken, CreateRefeshToken } = require("../Utils/jwt.token");

module.exports = async (userData, status, res) => {
  const AccessToken = await CreateAcessToken(userData._id, userData.role);
  const RefreshToken = await CreateRefeshToken(userData._id, userData.role);

  const AccessTokenOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.ACCESS_TOKEN_KEY_TIME_COOKIE) * 60 * 1000
    ),
    sameSite: "none",
    secure: true,
    httpOnly: true,
  };
  const RefreshTokenOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.REFRESH_TOKEN_KEY_TIME_COOKIE) * 8640000
    ),
    sameSite: "none",
    secure: true,
    httpOnly: true,
  };
  const UserTokenOptions = {
    expires: new Date(
      Date.now() + parseInt(process.env.REFRESH_TOKEN_KEY_TIME_COOKIE) * 8640000
    ),
  };

  res.cookie(ACCESS_KEY, AccessToken, AccessTokenOptions);
  res.cookie(REFRESH_KEY, RefreshToken, RefreshTokenOptions);
  res.cookie(HEUMN_USER_KEY, JSON.stringify(userData), UserTokenOptions);
  res.status(status).json({
    success: true,
    statusCode: status,
    user: {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    AccessToken,
  });
};
