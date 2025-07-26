import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

// ye wala middlewarre hame bananya hai takki iski help se ham log jo logout karana ho user ko toh kara saken aram se
// kyunki us wakt hamare paas koi id ya email nhi tha jiski help se ham user ki details nikal saken toh ham ye middleware banate hain
export const verifyJWT = asyncHandler(async(req,res,next)=> {
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","").trim();
        // jab authorisaation mile toh uske ander jahan bhi Bearer mile usko empty string se replace kar do
    
        console.log("AccessToken from cookie:", req.cookies?.accessToken);
        console.log("Authorization Header:", req.header("Authorization"));
        console.log("Extracted Token:", token);
        
        if(!token){
            throw new ApiError(401,"Unauthorised Error")
        }

        // ye wala jo hai woh hame ek aisa token dega jiski help se ham User ke ander se details extract kar sake aur select ke ander jo params mentioned hote hain woh unko delete kar deta hai
        const decodedTokenInfo= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedTokenInfo._id).select(
            "-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid access Token")
        }
    
        // agr tumko user mil jae toh usko req.user mein store up kardo aur phir next passOn kardo
        req.user =user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Toekn")
    }
})