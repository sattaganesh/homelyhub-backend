import slugify from "slugify";
import mongoose from "mongoose";
const propertySchema=new mongoose.Schema({
    propertyName:{
        type:String,
        required:[true,"please enter your property name"]
    },
    description:{
        type:String,
        required:[true,"please add information about ur property"]
    },
    extraInfo:{
        type:String,
        default:"checkin on time ,good service"
    },
    propertyType:{
        type:String,
        enum:["House","Flat","Guest House","Hotel"],
             default:"House"
    },
    roomType:{
        type:String,
        enum:["Anytype","Room","Entire Home"],
        default:"Anytype"
    },
    maxiumGuest:{
        type:Number,
        required:[true,"please give the max no of  guest that can occupy"]

    },
    amenities:[
        {
            name:{
                type:String,
                required:true,
                enum:["Wifi","kitchen","washingMachine","Tv","Poll","Free parking"]

            },
            icon:{
                type:String,
                required:true
            },
        }
        
    
],
images:{
    type:[
        {
            public_id:{
                type:String
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    validate:{
        validator:function(arr){
            return arr.length>=6;
        },
        message:"the images must contain atleast 6 image"
    }
},
price:{
    type:Number,
    required:[true,"please enter price per night value"],
    default:500

},
  address:{
    area:String,
    city:String,
    state:String,
    pincode:Number,
  },
  currentBookings:[
    {
        bookingId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Booking"
        },
        fromDate:{
        type:Date
    },
    toDate:{
        type:Date
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"

    }
    }
  ],

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
  },
  slug:String,
checkInTime:{type:String,default:"11:00"},
checkOutTime:{type:String,default:"13:00"}

})

propertySchema.pre("save",function(next){
this.slug=slugify(this.propertyName,{lower:true});
next();

})
propertySchema.pre("save",function(next){
    this.address.city=this.address.city.toLowerCAll(" ","")
    next();
})
//const property=mongoose.model("Property",propertySchema);
const Property =
    mongoose.models.Property ||
    mongoose.model("Property", propertySchema);
export{Property};
    
