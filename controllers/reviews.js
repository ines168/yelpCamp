const Campground = require("../models/campground");
const Review = require("../models/review");

const review_create_post = async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "Created a new review!");
    res.redirect(`/campgrounds/${camp._id}`);
};

const review_delete = async (req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted a review!")
    res.redirect(`/campgrounds/${id}`);
};

module.exports = {
    review_create_post,
    review_delete
};