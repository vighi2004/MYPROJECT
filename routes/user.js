const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
router.get("/signUp" ,(req,res)=>{
    res.render("user/signUp.ejs");
})

router.post("/signUp",wrapAsync(async(req,res)=>{
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
}));
router.get("/login",(req,res)=>{
    res.render("user/login.ejs");
})
router.post("/login",passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })
,async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    res.redirect("/listings");
})
router.get("/logOut",(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","You logged Out!")
        res.redirect("/listings");
    })
})
module.exports=router;