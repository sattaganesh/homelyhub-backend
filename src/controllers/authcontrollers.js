import { user } from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";
import {
    signinToken,
    createSendToken,
    defaultAvatarUrl,
    filterObj
} from "../utils/token.js";
import {
    sendMail,
    forgotPasswordMailGenContent
} from "../utils/mail.js";
import bcrypt from "bcrypt";

const Signup = async (req, res) => {
    try {
        const newuser = await user.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            avatar:{
                url: req.body.avatar || defaultAvatarUrl(req.body.name)
            }
        });

        createSendToken(newuser, 201, res);

    } catch (error) {
        const duplicatedField = Object.keys(error.keyPattern || {})[0];

        const message = duplicatedField
            ? `An account with that ${duplicatedField} already exists`
            : error.message;

        res.status(400).json({
            status: "fail",
            message
        });
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Your original condition was wrong
        if (!email || !password) {
            throw new Error("Please enter email and password");
        }

        // Don't call the variable "user" here
        const existingUser = await user
            .findOne({ email })
            .select("+password");

        if (
            !existingUser ||
            (await existingUser.correctPassword(
                password,
                existingUser.password
            )) === false
        ) {
            throw new Error("Incorrect email or password");
        }

        createSendToken(existingUser, 200, res);

    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: error.message
        });
    }
};
//protect
/*const protect=async(req,res,next)=>{
    try{
        //step1 finding a token
        let token;
        if(
            req.headers.authoriztion&&//extra info attached
            req.headers.authoriztion.startswith("Bearer")
        ){
            token =req.headers.authoriztion.split("")[1]
        }
        else if(req.cookies.jwt&&req.cookies.jwt!=="loggedout"){//req from browser
            token =req.cookie.jwt;
        }
        //step2:notoken
        if(!token){
            throw new Error("you are not logged in!please login to acccess")
        }
        //step3:token is real or not
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        //step4:token is real butcuser still exist
        const currentUser=await user.findById(decoded.id);
        if(!currentUser){
            throw new Error("the user belonging to token doesnot exists")
        };
        //step5:if some stole token
        if(currentuser.changePasswordAfter(decoded.iat)){
            throw new Error("user rectenly changed password please relogin")
        }
        //all checks passed
        req.user=currentUser;
        next();
    }
    catch(error){
        res.status(401).json({
        status:"fail",
        message : error.message
        });
    }


    }
export { Signup, login ,protect};*/
const protect = async (req, res, next) => {
    try {
        // 1. Find token
        let token;

        // Check Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        // Check cookie
        else if (
            req.cookies?.jwt &&
            req.cookies.jwt !== "loggedout"
        ) {
            token = req.cookies.jwt;
        }

        // 2. No token
        if (!token) {
            throw new Error(
                "You are not logged in! Please login to access"
            );
        }

        // 3. Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 4. Check user still exists
        const currentUser = await user.findById(decoded.id);

        if (!currentUser) {
            throw new Error(
                "The user belonging to this token does not exist"
            );
        }

        // 5. Check whether password was changed
        if (currentUser.changePasswordAfter(decoded.iat)) {
            throw new Error(
                "User recently changed password. Please login again"
            );
        }

        // 6. Attach user to request
        req.user = currentUser;

        next();

    } catch (error) {
        res.status(401).json({
            status: "fail",
            message: error.message
        });
    }
};
export { Signup, login ,protect};