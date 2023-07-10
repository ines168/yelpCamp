const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const {isLoggedIn, isAuthor, validateCampground} = require("../middleware");

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
}))

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", isLoggedIn, validateCampground, catchAsync(async (req, res) => {    
    // if (!req.body.campground) throw new ExpressError("Invalid campground data", 400);
    const newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
}))

router.get("/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path: "reviews", populate: {path:"author"}}).populate("author");
    if(!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground});
}))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground});
}))

router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp= await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true, new: true});
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${camp._id}`);
}))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds");
}))

module.exports = router;