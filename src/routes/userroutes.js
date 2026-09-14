//address list 
import express from "express";
import {Signup,login} from "../controllers/authcontrollers.js";
const router =express.Router();
router.route("/signup").post(Signup);
router.route("/login").post(login);
export {router}