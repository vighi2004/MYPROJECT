const mongoose=require("mongoose");
let Schema=mongoose.Schema;
const Passportlocalmongoose=require("passport-local-mongoose");
let userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
}
)
userSchema.plugin(Passportlocalmongoose);//this atomically give username and password.
module.exports=mongoose.model('User',userSchema);