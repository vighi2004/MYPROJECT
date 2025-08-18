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
           url:String,
           filename:String
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

        }],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        geometry:{
            type: {
                type: String,
                enum: ['Point'], // 'type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }

        })
        //this is for deleting reviews when you delete listing but id of not deleted from backend do this middleware willl call.
        listingschema.post("findOneAndDelete",async (listing)=>{
            if(listing){
              await Review.deleteMany({_id : {$in:listing.reviews}});
            }})
const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;