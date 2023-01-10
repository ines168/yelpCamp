const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Review = require("../models/review");
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const { reviewValidatingSchema } = require("../joi-schemas");

const validateReview = (req, res, next) => {    
    const {error} = reviewValidatingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message ).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await camp.save();
    await review.save();
    req.flash("success", "Created a new review!");
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted a review!")
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;