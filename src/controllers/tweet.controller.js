import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/vedio.model.js"
// import {User} from '../models/user.model.js'


const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    const { videoId} = req.params

    if(!content || content.trim() === ""){
        throw new ApiError(404,"Invalid content");
    }

    const video= await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"Video not found")
    }

    // now go for creating tweet for the vedio
    const createdTweet=await Tweet.create({
        content: content.trim(),
        owner: req.user._id,     // assumes req.user is populated by auth middleware
        video: videoId,
    })

    return res.status(200).json(
        new ApiResponse(
            200,
            createdTweet,
            "Tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {videoId} = req.params
    const {owner} =req.body

    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError("Invalid VideoID")
    }

    if(!owner || !mongoose.Types.ObjectId.isValid(owner)){
        throw new ApiError("UserId or Owner not found")
    }

    const TweetOwner=await User.findById(owner)

    if(!TweetOwner){
        throw new ApiError(400,"User not found")
    }

    // now get up all the tweets from the user 
    const tweets=await Tweet.find({
        user:owner,
        video:videoId,
    })
    .populate("owner","username avatar")

    return(res.status(200).json(
        new ApiResponse(
            200,
            tweets,
            "Fetched All the Tweets Successfully"
        )
    ))
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body

    if(!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400,"Invalid tweetId")
    }

    if(!content || content.trim() === ""){
        throw new ApiError(400,"Content not valid")
    }

    const tweet=await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError("Tweet for Updation not found")
    }
    tweet.content=content.trim();
    await tweet.save({validateBeforeSave:false})

    return(res.status(200).json(
        new ApiResponse(
            200,
            tweet,
            "Tweet Updated Successfully"
        )
    ))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    const {content} = req.body

    if(!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400,"Invalid tweetId")
    }

    // if(!content || content.trim() === ""){
    //     throw new ApiError(400,"Content not valid")
    // }

    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"Tweet not found")
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Tweet Deleted Successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}