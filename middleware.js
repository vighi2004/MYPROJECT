const Listing=require("./models/listing");
const Review = require("./models/reviews.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in to Add  Listings!");
            return res.redirect("/login");
        }
        next();
}
module.exports.savedUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    } 
    next();
}
module.exports.isowner=async(req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    
    if (!res.locals.currUser) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
    }
    if(!listing || !listing.owner.equals(res.locals.currUser._id)){
       req.flash("error","You are not owner of this listing");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
//for review delete checking.
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    let review = await Review.findById(reviewid);
    
    if (!res.locals.currUser) {
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
    }
    if(!review||!review.author.equals(res.locals.currUser._id)){
       req.flash("error","You are not Author of this Review!");
       return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.validlisting=async(req,res,next)=>{
     let{error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
module.exports.validReview=(req,res,next)=>{
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