const express=require("express");
const router=express.Router({mergeParams:true});//mergeparams is use to get id to add review like parent stores it to get by to child by call back we use this.
const Listing= require("../models/listing.js");
const Review = require("../models/reviews.js");

const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,validReview}=require("../middleware.js");
//post route for Review
router.post("/",isLoggedIn,validReview,wrapAsync(async(req,res)=>{//child
        let listing=await Listing.findById(req.params.id);
        let newreview=new Review(req.body.reviews);
        listing.reviews.push(newreview);
        await newreview.save();
        await listing.save();
        console.log("Review saved!");
        req.flash("success","New Review added!");
        res.redirect("/listings");
}))
//delete route for Review
router.delete("/:reviewid",isLoggedIn,wrapAsync(async(req,res)=>{//child
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("delete","Review Deleted!");
    res.redirect("/listings");
}))
module.exports=router;
