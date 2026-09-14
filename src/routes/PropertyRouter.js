import express from "express";
import {getproperties,getProperty} from "../controllers/propertycontroller.js";
const propertyRouter=express.Router();
propertyRouter.route("/").get(getproperties);
propertyRouter.route("/:id").get(getProperty);
export{propertyRouter};
