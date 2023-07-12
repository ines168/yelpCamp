const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const campgroundsController = require("../controllers/campgrounds")

router.get("/", catchAsync(campgroundsController.camp_index));

router.get("/new", isLoggedIn, campgroundsController.camp_create_get);

router.post("/", isLoggedIn, validateCampground, catchAsync(campgroundsController.camp_create_post))

router.get("/:id", catchAsync(campgroundsController.camp_details));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundsController.camp_edit_get));

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.camp_edit_post));

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgroundsController.camp_delete))

module.exports = router;