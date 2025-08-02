module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
            req.flash("error","You must be logged in to Add  Listings!");
            res.redirect("/login");
        }
        next();
}