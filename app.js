const express= require('express');
const app=express();
const ejsMate=require("ejs-mate");
const Listing= require("./models/listing.js");
const mongoose= require("mongoose")
const path=require("path");
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
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
app.get("/listings",async (req,res)=>
{
    let alllistings=await Listing.find();
    res.render("listings/index.ejs",{alllistings});
})

//Add route
app.get("/listings/add",(req,res)=>
    {
        res.render("listings/add.ejs")
    })
    
//show route
app.get("/listings/:id",async (req,res)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id);
    res.render("listings/Show.ejs",{list1});
})

//create route
app.post("/listings",async (req,res)=>
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
})
//youu can also write this instead of writting bigger code that is in input of add.ejs name=listing[title] write in all keys this is object that will generate key-value pair.
// let newlist= await new Listing(req.body.listing)
//await newlist.save()
//beacuse of this you will save more space 

app.get("/listings/:id/edit",async (req,res)=>
{
    let {id}=req.params;
    let list1= await Listing.findById(id);
    res.render("listings/edit.ejs",{list1});
})
//update route
app.put("/listings/:id",async (req,res)=>
{
    let {id}=req.params;
    let {title,description,image,price,location,country}=req.body;
    await Listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    res.redirect(`/listings/${id}`);

})
//delete route
app.delete("/listings/:id",async (req,res)=>
{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings");

})