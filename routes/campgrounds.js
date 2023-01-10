const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const {campgroundValidatingSchema} = require("../joi-schemas");

const validateCampground = (req, res, next) => {    
    const {error} = campgroundValidatingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message ).join(", ")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
}))

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", validateCampground, catchAsync(async (req, res) => {    
    // if (!req.body.campground) throw new ExpressError("Invalid campground data", 400);
    const newCamp = new Campground(req.body.campground);
    await newCamp.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

router.get("/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate("reviews");
    if(!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground});
}))

router.get("/:id/edit", catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground});
}))

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp= await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true, new: true});
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete("/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds");
}))

module.exports = router;