const express= require('express');
const app=express();
const ejsMate=require("ejs-mate");
const Listing= require("./models/listing.js");
const Review= require("./models/reviews.js");
const mongoose= require("mongoose")
const path=require("path");
const methodOverride=require("method-override");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");
const {reviewSchema}=require("./schema.js");
const { error } = require('console');
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);
main()
.then((res)=>{console.log("Connected to DB")})
.catch((err)=>{console.log(err)})
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

}
app.listen(3000,()=>
{
    console.log("connectes to port 3000");
});

app.get("/",(req,res)=>
{
    res.send("i am here");
})
//checking server validation
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

// app.get("/testlisting",(req,res)=>
// {
//     let samplelist=new Listing({
//         title:"MY Home Villa",
//         description:"My Beach",
//         image: {
//             filename: "listingimage",
//             url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//           },
//         price:1200,
//         location:"Mandogoan,Goa",
//         country:"India"

//     });
//     samplelist.save()
//     .then((res)=>{console.log(res)})
//     .catch((err)=>{console.log(err)})
//     res.send("tested success");
// })

//index route
app.get("/listings",wrapAsync(async (req,res,next)=>
{
    let alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
}))

//Add route
app.get("/listings/add",(req,res)=>
    {
        res.render("listings/add.ejs")
    })
    
//show route
app.get("/listings/:id",wrapAsync(async (req,res,next)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id).populate("reviews");
    console.log("✅ Populated Reviews:", list1.reviews);
    res.render("listings/Show.ejs",{list1});
}))

//create route
app.post("/listings",validlisting,wrapAsync(async (req,res,next)=>
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
    console.log(newListing);
    res.redirect("/listings");
}))
//youu can also write this instead of writting bigger code that is in input of add.ejs name=listing[title] write in all keys this is object that will generate key-value pair.
// let newlist= await new Listing(req.body.listing)
//await newlist.save()
//beacuse of this you will save more space 

app.get("/listings/:id/edit",wrapAsync(async (req,res,next)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id);
    res.render("listings/edit.ejs",{list1});
}))
//update route
app.put("/listings/:id",validlisting,wrapAsync(async (req,res,next)=>
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
    res.redirect(`/listings/${id}`);
}));
//delete route
app.delete("/listings/:id",wrapAsync(async (req,res,next)=>
{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");

}))
//post route for Review
app.post("/listings/:id/reviews",validReview,wrapAsync(async(req,res)=>{
        let listing=await Listing.findById(req.params.id);
        let newreview=new Review(req.body.reviews);
        listing.reviews.push(newreview);
        await newreview.save();
        await listing.save();
        console.log("Review saved!");
        res.redirect("/listings");
}))
//delete route for Review
app.delete("/listings/:id/:reviewid",wrapAsync(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    await Review.findByIdAndDelete(reviewid);
    res.redirect("/listings");
}))

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"}=err;
    res.render("listings/error.ejs",{message});
})