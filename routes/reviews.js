const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utilities/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewsController = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, catchAsync(reviewsController.review_create_post));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviewsController.review_delete));

module.exports = router;