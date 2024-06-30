const jwt = require("jsonwebtoken");

// generate the access token
module.exports.CreateAcessToken = async (userid, role) => {
  let payload = {
    id: userid,
    role,
  };

  const config = { expiresIn: process.env.ACCESS_TOKEN_KEY_TIME };
  const Token = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, config);

  return Promise.resolve(Token);
};

// generate the Refresh token
module.exports.CreateRefeshToken = async (userid, role) => {
  let payload = {
    id: userid,
    role,
  };

  const config = { expiresIn: process.env.REFRESH_TOKEN_KEY_TIME };
  const Token = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, config);

  return Promise.resolve(Token);
};

// verifying the access token
module.exports.VerifyAccessToken = async (token) => {
  try {
    let data = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    return Promise.resolve({ success: true, ...data });
  } catch (error) {
    return Promise.resolve({ success: false, error });
  }
};

// verifying  the refresh token
module.exports.VerifyRefreshToken = async (token) => {
  try {
    let data = jwt.verify(token, process.env.REFRESH_TOKEN_KEY);
    return Promise.resolve({ success: true, ...data });
  } catch (error) {
    return Promise.resolve({ success: false, error });
  }
};
