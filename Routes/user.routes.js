const express = require("express");
const {
  RegisterUserController,
  LoginUserController,
  LogoutUserController,
  MyAccountController,
  UpdateAccessTokenController,
  UpdateUserRoleController,
} = require("../Controllers/user.controller");
const {
  Authorization,
  Authentication,
} = require("../Middlewares/auth.middleware");

const UserRoutes = express.Router();

UserRoutes.route("/register").post(RegisterUserController);
UserRoutes.route("/login").post(LoginUserController);
UserRoutes.route("/logout").get(LogoutUserController);
UserRoutes.route("/my-profile").get(Authentication, MyAccountController);
UserRoutes.route("/new-access-token").get(UpdateAccessTokenController);
UserRoutes.route("/update-role/:userid").patch(
  Authentication,
  Authorization("admin"),
  UpdateUserRoleController
);

module.exports = UserRoutes;
