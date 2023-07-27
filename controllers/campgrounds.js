const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

const camp_index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
};

const camp_create_get = (req, res) => {
    res.render("campgrounds/new");
};

const camp_create_post = async (req, res) => {    
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCamp = new Campground(req.body.campground);
    newCamp.geometry = geoData.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.author = req.user._id;
    await newCamp.save();
    console.log(newCamp);
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${newCamp._id}`);
};

const camp_details = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id).populate({path: "reviews", populate: {path:"author"}}).populate("author");
    if(!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", {campground});
};

const camp_edit_get = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash("error", "Cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", {campground});
};

const camp_edit_post = async (req, res) => {
    const {id} = req.params;
    console.log(req.body);
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename}));
    const camp= await Campground.findByIdAndUpdate(id, {...req.body.campground, $push:{ images: imgs}}, {runValidators:true, new: true});
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
        console.log(camp);
    }
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${camp._id}`);
};

const camp_delete = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds");
};

module.exports = {
    camp_index, 
    camp_create_get, 
    camp_create_post, 
    camp_details, 
    camp_edit_get,
    camp_edit_post,
    camp_delete
}