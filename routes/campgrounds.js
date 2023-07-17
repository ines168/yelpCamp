const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");
const campgroundsController = require("../controllers/campgrounds");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(catchAsync(campgroundsController.camp_index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgroundsController.camp_create_post))
    
router.get("/new", isLoggedIn, campgroundsController.camp_create_get);

router.route("/:id")
    .get(catchAsync(campgroundsController.camp_details))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgroundsController.camp_edit_post))
    .delete(isLoggedIn, isAuthor, catchAsync(campgroundsController.camp_delete))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgroundsController.camp_edit_get));

module.exports = router;