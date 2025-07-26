const express= require('express');
const app=express();
const ejsMate=require("ejs-mate");
const mongoose= require("mongoose")
const path=require("path");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/reviews.js");
const session=require("express-session");
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
const sessionOptions={
  secret: "mysupersecretstring",
  resave:false,
  saveUninitialized:true,
  cookie:{
  expires:Date.now()+7*24*60*60*1000,
  maxAge: 7*24*60*60*1000,
  httpOnly:true
  },
};

app.use(session(sessionOptions));

app.listen(3000,()=>
{
    console.log("connectes to port 3000");
});

app.get("/",(req,res)=>
{
    res.send("i am here");
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);//parent
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong!"}=err;
    res.render("listings/error.ejs",{message});
})