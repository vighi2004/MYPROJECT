const express=require("express");
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isowner,validlisting}=require("../middleware.js");
const ListingController=require("../controllers/listing.js");
const {cloudinary,storage}=require("../cloudConfig.js");
const multer = require("multer");
const upload= multer({storage});


//index route
router.get("/",wrapAsync(ListingController.index));

//Add route
router.get("/add",isLoggedIn,ListingController.renderNewform);
    
//show route
router.get("/:id",wrapAsync(ListingController.showListing));

//create route
router.post("/",isLoggedIn,upload.single("image"),validlisting,wrapAsync(ListingController.createListing));
//youu can also write this instead of writting bigger code that is in input of add.ejs name=listing[title] write in all keys this is object that will generate key-value pair.
// let newlist= await new Listing(req.body.listing)
//await newlist.save()
//beacuse of this you will save more space 
//edit route
router.get("/:id/edit",isLoggedIn,isowner,wrapAsync(ListingController.renderEditform));
//update route
router.put("/:id",isLoggedIn,isowner,upload.single("image"),validlisting,wrapAsync(ListingController.updateListing));
//delete route
router.delete("/:id",isLoggedIn,isowner,wrapAsync(ListingController.destroyListing));
module.exports=router;