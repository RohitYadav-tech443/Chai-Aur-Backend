import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import path from "path"
import jwt from "jsonwebtoken"
import mongoose from 'mongoose';
import { pipeline } from 'stream';

const registerUser = asyncHandler(async(req, res) => {
    // res.status(200).json({
    //     message:"chai aur code",
    // })

    // below is the given DataStructure Algorithm

    // steps for procesing the data
    // get the user details from the frontend
    //  validation chech karo jo data usne send karta hai 
    // check if the user exists
    // check for the images, check for the avatar
    // fir data ko backend mien push kar do
    // ab ek user object banana padeega taaki mogoDb mein noSQl data entry kar sake objencts ke form mein
    // remove the password from the response
    //  check karo ki response aaya hai ki nhi - null hai ya response aaya hai

    const {fullname,email,username,password}= req.body

    // console.log("email:",email);

    // if(fullname === ""){
    //     throw new ApiError(400,"FullName is required")
    // }

    if(
       [fullname,email,username,password].some((field) => 
        field?.trim() === "")
    //    above wala statement saare mentioed elements par chalega aur jo empty hoga usko detect larega 
    )
    {
        throw new ApiError(400,"All fields are compulsory and required")
    }
    
   const existedUser=await User.findOne({
        // advance methods for checking the presence of the email earlier in the database
        $or: [{username},{email}]
    })
    if(existedUser) {
        throw new ApiError(409,"user with email and username already logedIn")
    }


    // over here we are using the optional chaining for checking wether the req.files exist there or not

    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar)
     && req.files.avatar.length >0){
        avatarLocalPath=req.files.avatar[0].path
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

    const avatar=await uploadCloudinary(path.resolve(avatarLocalPath))
    const coverImage=await uploadCloudinary(coverImageLocalPath)

    console.log("FILES RECEIVED:", req.files);
    
    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }
    // if(!coverImage){
    //     throw new ApiError(400,"CoverImage is required")
    // }


    const user=await User.create({
        fullname,
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // above syntax is used to find the user by the id and select mein hamne jo pass kiya hai woh uss id ko delete kar deta hai

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered successfully")
    )
})

const generateAccessandRefreshTokens= async (userId) => {
    try {
        const user =await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken= refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const loginUser = asyncHandler(async(req,res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send the  cookies and response for successfully logIn

    const {email,username,password} =req.body

    if(!username && !email){
        throw new ApiError(400,"Username or email is required")
    }


    // below given syntax is used to return either of the value of the emial or username which was send by the user
    const user =await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPasswordvalid= await user.isPasswordCorrect(password)

    if(!isPasswordvalid){
        throw new ApiError(401,"Password Incorrect")
    }

    const {accessToken,refreshToken}= await generateAccessandRefreshTokens(user._id)

    const loggedInUser=User.findById(user._id).select(
        "-password -refreshToken"
    )
   
    const options ={
        httpOnly:true,
        secure:true,
    }
    // Prevents client-side JavaScript from accessing the cookie. -> above line

    return res
    .status(200)
    .cookie("accessToken",accessToken, options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                // when user wants to save the given below three parameter from his side
                user:loggedInUser,accessToken,refreshToken
            },
            "User Looged In SuccessFully"
        )
        
    )
})

const logoutUser= asyncHandler(async(req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined
            }
        },{
            new:true
        }
    )

    const options ={
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out SuccessFully"))
})

const refreshAccessToken = asyncHandler(async( req,res) =>{
    const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorised request")
    }

    try {
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.ACCESS_TOKEN_SECRET
        )
    
        const user =await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"invalid user token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh Token has expired or used")
        }
    
        const options ={
            httpOnly:true,
            secure:true,
        }
    
        const {newaccessToken,newrefreshToken}=await generateAccessandRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToekn",newaccessToken,options)
        .cookie("refreshToekn",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken:newaccessToken,refreshToken:newrefreshToken},
                "Access Token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh Token")
    }
})

const changeCurrentPassword = asyncHandler(async(req,res) => {
    const {oldPassword,newPassword} = req.body

    // if(!(newPassword === confPassword)){

    // }

   const user= await User.findById(req.user?._id)
   const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)

   if(!isPasswordCorrect){
    throw new ApiError(400,"Invalid aold password")
   }

   user.password=newPassword
   await user.save({validateBeforeSave:false})

   return res.status(200)
   .json(new ApiResponse
    (
        200,
        {},
        "Password changed successfully"
    )
   )
})

const getCurrentUser=asyncHandler(async(req,res) => {
    return res.status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "Current user fetched Successfully"
    ))
})

const updateAccountDetails=asyncHandler(async(req,res) => {
    const {fullname,email} = req.body

    if(!fullname || !email){
        throw new ApiError(401,"All fields are required")
    }

    // below we are just updating the emial and the fullname of the user based upon the id send by the user
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            // here we use the mogodb operators
            $set:{
                fullname,
                email:email

            }
        },
        // below true is used to mark up the things that given params are updated successfully and it doesn't return us the old data 
        {new :true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200,user,"Account details updated Successfully"))
})

const updateUserAvatar= asyncHandler(async(req,res) => {
    const avatarLocalPath=req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on Avatar")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url,
            }
        },
        {new :true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"Avatar updated Successfully")
    )
})

const updateUserCoverImage= asyncHandler(async(req,res) => {
    const coverImageLocalPath=req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400,"CoverImage file is missing")
    }

    const coverImage=await uploadCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400,"Error while uploading on CoverImage")
    }

    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url,
            }
        },
        {new :true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"CoverImage updated Successfully")
    )
})

// jab ham aggregate pipelines use karte hain toh jo values aati hain woh ek array ke form mein aati hai
const getUserChannelProfile=asyncHandler(async(req,res) => {
     const {username} =req.params

     if(!username?.trim()){
        throw new ApiError(400,"username is missing")
     }

     const channel= await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        // below code blocks are the aggregation pipelines
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers",
            },
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo",
            }  
        },
        // size -> is used to tell us the size of the mentioned filed aas how much they contains
        // cond-> it is used to set up the condition using if then or else 
        // in -> iska mtlb hia check karna woh present hai ya nhi hai
        {
            $addFields:{
                subscribersCount:{
                    $size:"subscribers",
                },
                channelsSubscribedToCount:{
                    $size:subscribedTo
                },
                isSubscribed:{
                    $cond:{
                        if:{
                            $in:[req.user?._id,"$subscribers.subscriber"]
                        },
                        then:true,
                        else:false,
                    }
                }
            }
        },
        {
            $project:{
                // fullname 1 ye batata hai ki woh value ON hao
                fullname:1,
                username:1,
                subscribersCount:1,
                channelsSubscribedToCount:1,
                avatar:1,
                coverImage:1,
                email:1,
            }
        }
     ])

     if(!channel?.length){
        throw new ApiError(404,"channel dpes not exist")
     }

     return res.status(200).json(
        new ApiResponse(
            200,
            channel[0],
            "User channel fetched successfully"
        )
     )
})
//  below in the pipeline aggregations we use the nested pipelines concept such that value from one part can be passed to other easily hand to hand
const getWatchHistory=asyncHandler(async(req,res) => {
    const user = await user.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(String(req.user._id))
                
            }
        },
        {
            $lookup:{
                from:"Vedio",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        user:1,
                                        avatar:1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return user
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "watch history fetched Successfully"
        )
    )
    
})
 
export {registerUser,
        loginUser,
        logoutUser,
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetails,
        updateUserAvatar,
        updateUserCoverImage,
        getUserChannelProfile,
        getWatchHistory,
}
// now we are going to create the routes
