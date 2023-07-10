const Campground = require("./models/campground");
const Review = require("./models/review");
const {campgroundValidatingSchema, reviewValidatingSchema} = require("./joi-schemas");
const ExpressError = require("./utilities/ExpressError");

const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        // console.log(req.session);
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};

const storeReturnTo = (req, res, next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

const isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do this!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

const isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do this!");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

const validateCampground = (req, res, next) => {    
    const {error} = campgroundValidatingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message ).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {    
    const {error} = reviewValidatingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message ).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
module.exports = { isLoggedIn, storeReturnTo, isAuthor, isReviewAuthor, validateCampground, validateReview };