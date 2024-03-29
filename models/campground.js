const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const opts = {toJSON: {virtuals:true}};

const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload", "/upload/c_fill,h_130,w_200");
});

const campgroundSchema = new Schema({
    title: String,
    images: [imageSchema],
    geometry: {
        type: {type: String, enum: ["Point"], required:true},
        coordinates: {type: [Number], required: true}
    },
    price: Number,
    description: String,
    location: String,
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
    author: {type:Schema.Types.ObjectId, ref: "User"}
}, opts);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>
    <p>${this.description.substring(0,20)}...</p>`
})

campgroundSchema.post("findOneAndDelete", async function(campground) {
    if(campground.reviews.length) {
        const res = await Review.deleteMany({_id: {$in: campground.reviews}})
        console.log(res);
    }
})

module.exports = mongoose.model("Campground", campgroundSchema);
