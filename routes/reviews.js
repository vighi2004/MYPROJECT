const express=require("express");
const router=express.Router({mergeParams:true});//mergeparams is use to get id to add review like parent stores it to get by to child by call back we use this.
const Listing= require("../models/listing.js");
const Review = require("../models/reviews.js");
const ReviewController=require("../controllers/reviews.js");

const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,validReview,isReviewAuthor}=require("../middleware.js");
//post route for Review
router.post("/",isLoggedIn,validReview,wrapAsync(ReviewController.createReview));
//delete route for Review
router.delete("/:reviewid",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview));
module.exports=router;
