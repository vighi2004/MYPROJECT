const express=require("express");
const router=express.Router({mergeParams:true});//mergeparams is use to get id to add review like parent stores it to get by to child by call back we use this.
const Listing= require("../models/listing.js");
const Review = require("../models/reviews.js");

const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
//check server review
const validReview=(req,res,next)=>{
    console.log("Received Data in Middleware:", req.body); 
    let{error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
//post route for Review
router.post("/",validReview,wrapAsync(async(req,res)=>{//child
        let listing=await Listing.findById(req.params.id);
        let newreview=new Review(req.body.reviews);
        listing.reviews.push(newreview);
        await newreview.save();
        await listing.save();
        console.log("Review saved!");
        res.redirect("/listings");
}))
//delete route for Review
router.delete("/:reviewid",wrapAsync(async(req,res)=>{//child
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect("/listings");
}))
module.exports=router;
