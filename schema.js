const Joi = require('joi');

const listingSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().uri().allow(null, ''),
    price: Joi.number().min(0).required(),
    location: Joi.string().required(),
    country: Joi.string().pattern(/^[A-Za-z\s]+$/).required() // Only allows letters & spaces
});

const reviewSchema=Joi.object({
    reviews:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required()
    })
}).required();

module.exports = { listingSchema, reviewSchema };