const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {savedUrl}=require("../middleware.js");
const UserController=require("../controllers/users.js");
router.get("/signUp" ,UserController.renderSignupForm);

router.post("/signUp",wrapAsync(UserController.signUp));

router.get("/login",UserController.renderLoginForm);

router.post("/login",savedUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true })
,UserController.Login);

router.get("/logOut",UserController.LogOut);
module.exports=router;