/*import{ Property} from "../Models/propertyModel.js";
import {Booking} from "../Models/bookingModel.js";
const createOrder=async(req,res)=>{
    const{amount,propertyId,fromdate,todate,guests}=req.body;
    //orderid creation
    const orderId ="order_"+Date.now();
    res.json({
        Success:true,
        message:"order created successfully",
        orderId,
        amount,
        propertyId,
        fromdate,
        todate,
        guests
})
}
//verify payment//save booking is done and blockthe dates selected
const verifyPayment=async(req,res)=>{
    const{orderId,bookingDetails,forceStatus}= req.body;
    if(forceStatus=="success"){
        const paymentId="pay_"+Date.now()
        //save bboking
        const newBooking=await Booking.create({
            user: req.user_id,
            property:bookingDetails.property,
            price:bookingDetails.price,
            fromDate:bookingDetails.fromDate,
            toDate:bookingDetails.toDate,
            guests:bookingDetails.guests,
            numberofnights:bookingDetails.nights,
            paid:true
        });
        //tell property those dates are taken
        const updatedProperty=await Property.findByIdAndUpdate(
            bookingDetails.propertyId,{
                $push:{
                    currentBookings:{
                     bookingId: newBooking._id,
                        fromDate:bookingDetails.fromDate,
                        toDate:bookingDetails.toDate,
                        userId:req.user._id

                    }
                }
            },{new:true}
        );
        res.json({
            success:true,
            message:"paymennt successful,booking confirmed!",
            paymentId,
            orderId,
            booking:newBooking
        });
    }
    else{
        res.status(400).json({
            success:false,
            message:"payment failed",
            orderId
        })
    }
}
//get my bookings
const getUserBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find({user:req.user._id})
        res.status(200).json({
            status:"success",
            data:{
                bookings
            }
        })
    }
    catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message
        })

    }
}
//get one booking details
//:id
const getBookingDetails=async(req,res)=>{
    try{
      const bookings=await Bokking.findById(re.params.bookingId);
    }catch(error){
        res.status(401).json({
            status:"fail",
            message:error.message

        })
    }
}
export{getBookingDetails,getUserBookings,createOrder,verifyPayment}*/

import { Property } from "../Models/propertyModel.js";
import { Booking } from "../Models/bookingModel.js";

// ==========================================
// CREATE ORDER
// ==========================================
const createOrder = async (req, res) => {
    try {
        const {
            amount,
            propertyId,
            fromDate,
            toDate,
            guests
        } = req.body;

        // Create a temporary order ID
        const orderId = "order_" + Date.now();

        res.status(200).json({
            success: true,
            message: "Order created successfully",
            orderId,
            amount,
            propertyId,
            fromDate,
            toDate,
            guests
        });

    } catch (error) {
        console.error("CREATE ORDER ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// VERIFY PAYMENT & CREATE BOOKING
// ==========================================
const verifyPayment = async (req, res) => {
    try {
        const {
            orderId,
            bookingDetails,
            forceStatus
        } = req.body;

        // Check payment status
        if (forceStatus === "success") {

            const paymentId = "pay_" + Date.now();

            // Create booking
            const newBooking = await Booking.create({
                user: req.user._id,
                property: bookingDetails.property,
                price: bookingDetails.price,
                fromDate: bookingDetails.fromDate,
                toDate: bookingDetails.toDate,
                guests: bookingDetails.guests,
                numberofnights: bookingDetails.nights,
                paid: true
            });

            // Update property with booked dates
            const updatedProperty = await Property.findByIdAndUpdate(
                bookingDetails.propertyId,
                {
                    $push: {
                        currentBookings: {
                            bookingId: newBooking._id,
                            fromDate: bookingDetails.fromDate,
                            toDate: bookingDetails.toDate,
                            userId: req.user._id
                        }
                    }
                },
                {
                    new: true
                }
            );

            // Check whether property exists
            if (!updatedProperty) {
                return res.status(404).json({
                    success: false,
                    message: "Property not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Payment successful, booking confirmed!",
                paymentId,
                orderId,
                booking: newBooking
            });

        } else {

            res.status(400).json({
                success: false,
                message: "Payment failed",
                orderId
            });
        }

    } catch (error) {
        console.error("VERIFY PAYMENT ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// GET ALL BOOKINGS OF LOGGED-IN USER
// ==========================================
const getUserBookings = async (req, res) => {
    try {

        const bookings = await Booking.find({
            user: req.user._id
        });

        res.status(200).json({
            status: "success",
            results: bookings.length,
            data: {
                bookings
            }
        });

    } catch (error) {
        console.error("GET USER BOOKINGS ERROR:", error);

        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};


// ==========================================
// GET ONE BOOKING
// ==========================================
const getBookingDetails = async (req, res) => {
    try {

        const booking = await Booking.findById(
            req.params.bookingId
        );

        if (!booking) {
            return res.status(404).json({
                status: "fail",
                message: "Booking not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                booking
            }
        });

    } catch (error) {
        console.error("GET BOOKING DETAILS ERROR:", error);

        res.status(500).json({
            status: "fail",
            message: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================
export {
    getBookingDetails,
    getUserBookings,
    createOrder,
    verifyPayment
};

