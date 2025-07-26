const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({
  secret: "mysupersecretstring",
  resave:false,
  saveUninitialized:true
}));
app.use(flash());
app.get("/take",(req,res)=>{
    let {name="Anonymous"}=req.query;
    req.flash('info',"takeUforward");
    req.session.name=name;
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name, msg:req.flash("info")});
})
app.listen(8000,()=>{
   console.log("sucesfully");
})