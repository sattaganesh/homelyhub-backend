import express from "express";
const bookingrouter=express.Router()
import {getBookingDetails,getUserBookings,createOrder,verifyPayment} from '../controllers/bookingcontroller.js';
import{protect}from "../controllers/authcontrollers.js";
bookingrouter.get("/",protect,getUserBookings);
bookingrouter.get("/:bookingId",protect,getBookingDetails);
bookingrouter.post("/create-Order",protect,createOrder);
bookingrouter.post("/verify-payment",protect,verifyPayment);
export{bookingrouter};