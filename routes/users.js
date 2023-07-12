const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const usersController = require("../controllers/users");

router.get("/register", usersController.user_register_get);

router.post("/register", catchAsync(usersController.user_register_post))

router.get("/login", usersController.user_login_get);

router.post("/login", storeReturnTo, passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", keepSessionInfo: true}), usersController.user_login_post );

router.get("/logout", usersController.user_logout);

module.exports = router;