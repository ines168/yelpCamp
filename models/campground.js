const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

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
    price: Number,
    description: String,
    location: String,
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}],
    author: {type:Schema.Types.ObjectId, ref: "User"}
});

campgroundSchema.post("findOneAndDelete", async function(campground) {
    if(campground.reviews.length) {
        const res = await Review.deleteMany({_id: {$in: campground.reviews}})
        console.log(res);
    }
})

module.exports = mongoose.model("Campground", campgroundSchema);
