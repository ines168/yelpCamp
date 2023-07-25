const Joi = require("joi");

module.exports.campgroundValidatingSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().min(0).required(),
        // image: Joi.array().required(),
        description: Joi.string().required()  
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewValidatingSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})