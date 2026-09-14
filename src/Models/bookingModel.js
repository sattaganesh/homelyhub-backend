import mongoose from "mongoose";
const bookingsSchema =new mongoose.Schema({
    property:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Property",
      required:[true,"booking must belong to a property"]
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:[true,"booking must belong to a user"]
    },
    price:{
        type:Number,
        required:[true,"booking must have price"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    },
    fromDate:{
        type:Date
    },
    toDate:{
        type:Date
    },
    guests:{
        type:Number
    },

    numberofnights:{
        type:Number
    }
},
{timestamps:true}
);
  bookingsSchema.pre(/^find/, function () {
    this.populate("user");

    this.populate({
        path: "property",
        select: "maximumGuest images propertyName address"
    });
});

const Booking = mongoose.model("Booking", bookingsSchema);

export { Booking };