const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signUp.ejs");
};

module.exports.signUp=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    let registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
       req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    })
    }
    catch(e){
         req.flash("delete",e.message);
         res.redirect("/signUp"); 
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs");
};


module.exports.Login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
};

module.exports.LogOut=(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You logged Out!")
        res.redirect("/listings");
    })
};
