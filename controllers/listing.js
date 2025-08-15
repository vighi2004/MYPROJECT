const Listing=require("../models/listing");
module.exports.index=async (req,res,next)=>
{
    let alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
};

module.exports.renderNewform=(req,res)=>
{
        res.render("listings/add.ejs")
};

module.exports.showListing=async (req,res,next)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if (!list1) {
      req.flash("error", "Listing no longer exists!");
      return res.redirect("/listings");
    }
   // console.log("✅ Populated Reviews:", list1.reviews);
    res.render("listings/Show.ejs",{list1});
};

module.exports.createListing=async (req,res,next)=>
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
    newListing.owner=req.user._id; 
    await newListing.save();
    //console.log(newListing);
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditform=async (req,res,next)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id);
    res.render("listings/edit.ejs",{list1});
};

module.exports.updateListing=async (req,res,next)=>
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
};

module.exports.destroyListing=async (req,res,next)=>
{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    req.flash("delete","Listing Deleted Succesfully!");
    return res.redirect("/listings");
};