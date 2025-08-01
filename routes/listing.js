const express=require("express");
const router=express.Router();
const Listing= require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../schema.js");

const validlisting=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
}
//index route
router.get("/",wrapAsync(async (req,res,next)=>
{
    let alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
}))

//Add route
router.get("/add",(req,res)=>
    {
        res.render("listings/add.ejs")
    })
    
//show route
router.get("/:id",wrapAsync(async (req,res,next)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id).populate("reviews");
    console.log("✅ Populated Reviews:", list1.reviews);
    res.render("listings/Show.ejs",{list1});
}))

//create route
router.post("/",validlisting,wrapAsync(async (req,res,next)=>
{
    let {title:title,description:description,image:image,price:price,location:location,country:country}=req.body;
    const newListing =  await new Listing({
        title,
        description,
        image,
        price,
        location,
        country
    });
    await newListing.save();
    //console.log(newListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}))
//youu can also write this instead of writting bigger code that is in input of add.ejs name=listing[title] write in all keys this is object that will generate key-value pair.
// let newlist= await new Listing(req.body.listing)
//await newlist.save()
//beacuse of this you will save more space 

router.get("/:id/edit",wrapAsync(async (req,res,next)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id);
    res.render("listings/edit.ejs",{list1});
}))
//update route
router.put("/:id",validlisting,wrapAsync(async (req,res,next)=>
{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    let listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).send("Listing not found!");
    }

    if (image && image.trim() !== "") {
        listing.image = { url: image };  // Store URL inside an object
    }

    // Update other fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.location = location;
    listing.country = country;

    await listing.save(); // Save updated listing
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}));
//delete route
router.delete("/:id",wrapAsync(async (req,res,next)=>
{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("delete","Listing Deleted Succesfully!");
    res.redirect("/listings");

}))
module.exports=router;