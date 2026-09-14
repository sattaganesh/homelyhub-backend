import express from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import mangoDB from "./utils/db.js";
import {router} from "./routes/userroutes.js";
import {propertyRouter} from "./routes/PropertyRouter.js";
import{bookingrouter} from "./routes/bookingrouter.js";
dotenv.config();
const app=express();
app.use(express.json({limit:"100mb"}));
app.use(express.urlencoded({limit:"100mb",extend:true}));
app.use(cookieparser());
const PORT=process.env.PORT;
app.get("/",(req,res)=>{
    res.send("server is running");

})
app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing",propertyRouter)
app.use("/api/v1/rent/user/booking", bookingrouter)
mangoDB();
app.listen(PORT,"::",()=>{
    console.log("app running on port:",PORT);
});
