import mongoose from "mongoose";
import validator from "validator";
import bcrypt from"bcrypt";
import crypto from "crypto";
const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"please enter your name"],
            trim:true,
            maxlength:[50,"namemustbe less than 50 words"],
        },
        email:{
            type:String,
            required:[true,"enter a valid email"],
            unique:true,
            lowercase:true,
            trim:true,
            validate:[validator.isEmail,"please enter"],

        },
        password:{
            type:String,
            required:[true,"please enter password"],
            minlength:[6,"password must greater than 6 characters"],
            select:true,

        },
        passwordConfirm:{
            type:String,
            required:[true,"please confirm password"],
            validate:{
                validator:function(el){
                    return el ===this.password
                },
                message:"passwords are not same"
               
            }

        },
        phoneNumber:{
            type:String,
            required:[true],
            unique:true,

        },
        role:{
            type:String,
            enum:["user","admin"],
            default:"user",
        },
        avatar:{
            url:{type:String},
            public_id:{type:String},
        },
        passwordChangedAt:
        {
            type:Date,
        },
        passwordResetToken:{
            type:String,
            select:false,
            index:true
         },
         passwordResetExpires:{
            type:Date,
            select:false,  
         },
    },{timestamps:true}
)
userSchema.set("toJSON", {
    transform:function(doc,ret){
        delete ret.password;
       delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret._v;
        return ret;
}
})
//password logic
//hashing
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,12)
    this.passwordConfirm=undefined
})
// login check
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword)
}
//if someone stole password 
userSchema.methods.changePasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp=parseInt(
         this.passwordChangedAt.getTime()/1000,
        10
        );
    return JWTTimestamp < changedTimeStamp;
 }
 return false;
}
//forgot password
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.passwordResetToken=crypto.createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.passwordResetExpires=Date.now()+10 *60 *1000;
    return resetToken;
}

const user=mongoose.model("user",userSchema);
export{user};

