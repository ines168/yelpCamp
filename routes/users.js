const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const usersController = require("../controllers/users");

router.route("/register")
    .get(usersController.user_register_get)
    .post(catchAsync(usersController.user_register_post))

router.route("/login")
    .get(usersController.user_login_get)
    .post(storeReturnTo, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", keepSessionInfo: true}), usersController.user_login_post );

router.get("/logout", usersController.user_logout);

module.exports = router;