const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utilities/catchAsync");
const ExpressError = require("./utilities/ExpressError");
const Campground = require("./models/campground");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    // useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", {campgrounds})
}))

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});

app.post("/campgrounds", catchAsync(async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError("Invalid campground data", 400);
        const newCamp = new Campground(req.body.campground);
        await newCamp.save();
        res.redirect(`/campgrounds/${newCamp._id}`);
}))

app.get("/campgrounds/:id", catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", {campground});
}))

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", {campground});
}))

app.put("/campgrounds/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    const camp= await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators:true, new: true});
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}))

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404))
})

app.use((err, req, res, next) => {
    // const {statusCode = 500, message = "Something went wrong"} = err;
    const {statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong!";
    res.status(statusCode).render("error", {err});
})

app.listen(3000, () => {
    console.log("Serving on port 3000!");
});