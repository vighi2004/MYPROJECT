const mongoose=require("mongoose")
const initdata=require("./data.js");
const Listing=require("../models/listing.js");
main()
.then((res)=>{console.log("Connected to DB")})
.catch((err)=>{console.log(err)})
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

};

const initdb=async ()=>
{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"688dd8e5facf04cd4e00880c"}));
    await Listing.insertMany(initdata.data);
    console.log("initialized");
}
initdb();