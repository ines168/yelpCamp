const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utilities/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Created a new review!");
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted a review!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;