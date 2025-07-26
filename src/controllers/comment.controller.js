import mongoose from 'mongoose'
import {Comment} from '../models/comment.models.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import {Video} from "../models/vedio.model.js"

const getVideoComments = asyncHandler(async(req,res) =>{
    const {videoId} =req.params
    const {page =1 ,limit =10} = req.query

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid Video Id");
    }

    const comments =await Comment.find({video: videoId})
                                 .sort({createdAt: -1})
                                 .skip((page -1)* limit)
                                 .limit(parseInt(limit))
                                 .populate("user","username avatar")
                                 // lat one popoulate is the optional whether you want to use it or not

    const totalComments= await Comment.countDocuments({video: videoId})

    return res.status(200).json(
        new ApiResponse(200,{
            comments,
            // here we use the pafgination as sometimes we can expect the large no of comments on the video so it boots the performance while handling the large no of comments
            pagination:{
                total:totalComments,
                page:Number(page),
                limit:Number(limit),
                totalPages:Math.ceil(totalComments/limit),
            }
        },"Comments fetched Successfully")
    )
})

const addComment=asyncHandler(async(req,res) => {
     const {videoId} =req.params
     const {comment} =req.body

     if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(404,"Invalid videoId to fetch the comments");
     }

    //  check if the vedio exists or not 
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    // Validate comment content

    if(!comment || comment.trim() === ""){
        throw new ApiError(400,"Comment content cannot be empty")
    }

     const newComment= await Comment.create({
        video:videoId,
        user:req.user._id,
        comment:comment.trim()
     })
    //  this.comment=comment 
     
     return req.status(200).json(
        new ApiResponse(
            200,
            newComment,
            "Comment added successfully"
        )
     )
})

const updateComment = asyncHandler(async (req, res) => {
    const {commentId} =req.params
    // const {comment} =req.body

    if(!commentId || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(404,"Invalid videoId");
    }

    const existingComment=await Comment.findById(commentId)

    if(!existingComment){
        throw new ApiError(404,"existingComment not found");
    }

    // if(!comment || comment.trim() === ""){
    //     throw new ApiError(400,"Comment content cannot be empty")
    // }

    existingComment.comment=comment.trim();
    await existingComment.save({validateBeforeSave:false})

    return req.status(200).json(
        new ApiResponse(
            200,
            existingComment,
            "Comment updated successfully"
        )
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId}= req.params
    const {comment} =req.body

    if(!commentId || !mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(404,"Invalid Comment id")
    }

    if(!comment || comment.trim() === ""){
        throw new ApiError("Comment cannot be empty");
    }

    const deletedComment=await Comment.findByIdAndDelete(commentId)

    if(!deletedComment){
        throw new ApiError(404,"Comment not found to delete")
    }

    // deletedComment.comment="";
    await deletedComment.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedComment,
            "Comment deleted successfully"
        )
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment,
    }