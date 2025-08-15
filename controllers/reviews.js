const Listing= require("../models/listing");
const Review = require("../models/reviews");
module.exports.createReview=async(req,res)=>{//child
        const { id } = req.params;
        let listing=await Listing.findById(req.params.id);
        let newreview=new Review(req.body.reviews);
        newreview.author=req.user._id;
        listing.reviews.push(newreview);
        await newreview.save();
        await listing.save();
        console.log("Review saved!");
        req.flash("success","New Review added!");
        return res.redirect(`/listings/${id}`); 
};

module.exports.destroyReview=async(req,res)=>{//child
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    req.flash("delete","Review Deleted!");
    return res.redirect(`/listings/${id}`);  
};