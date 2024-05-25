const express = require("express");
const {
  CreateUserController,
  LoginUserController,
  LogoutUserController,
  GenerateAccessTokenController,
  MyAccountController,
  UpdatePasswordController,
} = require("../Controllers/user.controller");
const { Authentication, Authorization } = require("../Middlewares/Auth");
const UserRoutes = express.Router();

// ### Register related routes
UserRoutes.route("/register").post(CreateUserController);

// ### Login related routes
UserRoutes.route("/login").post(LoginUserController);
UserRoutes.route("/logout").get(Authentication, LogoutUserController);

// ### Refresh Access Token
UserRoutes.route("/get_access_token").get(GenerateAccessTokenController);

// ### user info
UserRoutes.route("/me").get(Authentication, MyAccountController);

UserRoutes.route("/me/update-password").put(
  Authentication,
  Authorization("user", "admin"),
  UpdatePasswordController
);

module.exports = UserRoutes;
