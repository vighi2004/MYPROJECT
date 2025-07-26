const mongoose=require("mongoose");
const Review = require("./reviews");
const { listingSchema } = require("../schema");
let Schema=mongoose.Schema;
const listingschema=new Schema(
    {
        title:
        {
            type:String,
            required:true
        },
        description:{
            type:String
        },
        image:{
            filename:{
                type:String,
             
            },
            url:{
                type:String,
                set:(v)=>v===" "?"https://st2.depositphotos.com/6544740/9337/i/450/depositphotos_93376090-stock-photo-sunset-over-an-ocean-beach.jpg":v,
                default:"https://st2.depositphotos.com/6544740/9337/i/450/depositphotos_93376090-stock-photo-sunset-over-an-ocean-beach.jpg",
               
            }
        },
        price:{
            type:Number,
        },
        location:{
            type:String,
        },
        country:{
            type:String,
        },
        reviews:[{
            type:Schema.Types.ObjectId,
            ref:"Review"

        }]

        })
        //this is for deleting reviews when you delete listing but id of not deleted from backend do this middleware willl call.
        listingschema.post("findOneAndDelete",async (listing)=>{
            if(listing){
              await Review.deleteMany({_id : {$in:listing.reviews}});
            }})
const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;