import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/vedio.model.js"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid VideoId");
    }
    
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found")
    }

    const existingLike=await Like.findOne({
        video: videoId,
        likedBy:req.user._id
    })

    let message="";
    if(existingLike){
        // then unlike the video
        await Like.findByIdAndDelete(existingLike._id);
        message="Video unliked successfully";
    }else{
        await Like.create({
            video:videoId,
            likedBy:req.user._id,
        })
        message="Video liked successfully"
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            message,
        )
    )

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    if(!commentId || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(404,"Invalid id");
    }

    const comment=await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(400,"Comment not found")
    }

    const existingLike=await Like.findOne({
        comment:commentId,
        likedBy:req.user._id,
    })
    message="";

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        message="Comment unliked Successfully";
    }
    else{
        await Like.create({
            comment:commentId,
            likedBy:req.user._id,
        })
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            message,
        )
    )

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    if(!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(404,"Invalid id");
    }

    const tweet=await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(400,"tweet not found")
    }

    const existingLike=await Like.findOne({
        tweet:tweetId,
        likedBy:req.user._id,
    })
    message="";

    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id);
        message="tweet unliked Successfully";
    }
    else{
        await Like.create({
            tweet:tweetId,
            likedBy:req.user._id,
        })
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            message,
        )
    )
})


const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user._id;

    const likedVideos=await Like.find({
        likedBy:userId,
        video:{ $ne: null},
    })
    .populate("video")
    .sort({createdAt: -1});

    const videos=likedVideos.map((like) => like.video)

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Liked Videos Fetched Successfully"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}