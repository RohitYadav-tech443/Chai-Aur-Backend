import mongoose,{isValidObjectId} from "mongoose"
import {Video} from "../models/vedio.model.js"
import {User} from '../models/user.model.js'
import {ApiError} from '../utils/ApiError.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadCloudinary } from "../utils/cloudinary.js"

const getAllVedios = asyncHandler(async(req,res) =>{
    const {
        page =1,
        limit =10,
        query ="",
        sortBy="createdAt",
        sortType="desc",
        userId
    } =req.query

    // pagination path
    const skip=(parseInt(page)-1) * parseInt(limit);

    const filter ={};

    if(query){
        filter.title={$regex:query,$options:'i'};
    }

    if(userId){
        if(!isValidObjectId(userId)){
            throw new ApiError(400,"Invalid userId");
        }
        filter.owner=userId;
    }

    // sort the object 
    const sort ={};
    sort[sortBy] = sortType === 'asc'?1:-1;

    // fetch videos with pagination and optional filters
    const vedios =await Video.find(filter)
                            .sort(sort)
                            .skip(skip)
                            .limit(parseInt(limit))
                            .populate("owner","fullname avatar");


    // Total number of matching vedios
    const total=await Video.countDocuments(filter)
    // send response
    return res.status(200)
    .json(
        new ApiResponse(200,{
            vedios,
            page:parseInt(page),
            limit:parseInt(limit),
            total,
            totalPages:Math.ceil(total/limit)
        },"All vedios fetched successfully")
    )

})

const publishAVedio = asyncHandler(async(req,res) => {
    const {title,description} =req.body

    if(!title || !description){
        throw new ApiError(400,"Title and description are required");
    }
    
    if(!req.files || !req.files.video){
        throw new ApiError(400,"Vedio file is required");
    }

    const videoFile=req.files.video;

    const uploadedVideo = await uploadCloudinary(videoFile.tempFilePath,"video");

    if(!uploadedVideo?.secure_url){
        throw new ApiError(500,"failed to upload video to Cloudinary");
    }

    // save the info in the database
    const newVideo=await Video.create({
        title,
        description,
        videoFile:{
            url:uploadedVideo.secure_url,
            public_id:uploadedVideo.public_id
        },
        owner: req.user._id,
    });

    return res.status(201)
              .json(
                new ApiResponse(201,
                    newVideo,
                    "Video published Successfully"
                  )
                )
})

const getVideoById = asyncHandler(async(req,res) => {
    const {videoId} =req.params;

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid vedioID");
    }

    // get the vedioId path and check for it 
    const videoIdPath=await Video.findById(videoId).populate("owner","fullname avatar");

    if(!videoIdPath){
        throw new ApiError(404,"Video not found");
    }

    return res.status(200)
               .json(
                new ApiResponse(
                    200,
                    videoIdPath,
                    "video fetched successfully"
                )
               )
})



const updateVideo = asyncHandler(async(req,res) =>{
    const {videoId} = req.params;
    const {title,description} = req.body;

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }

    if(!title || !description){
        throw new ApiError(400,"Title and description are required");
    }

    video.title=title;
    video.description=description;

    if(req.files && req.files.video){
        const videoFile=req.files.video;
        const uploaded=await uploadCloudinary(videoFile.tempFilePath,"video");
        if(!uploaded?.secure_url){
            throw new ApiError(500,"Failled to opload the video on the cloudinary");
        }

        video.videoFile={
            url:uploaded.secure_url,
            public_id:uploaded.public_id,
        }
    }

    await video.save({validateBeforeSave:false}); // validateBeforeSave:false to skip validation for the videoFile field

    return res.status(200)
                .json(
                    new ApiResponse(
                        200,
                        video,
                        "Video updated successfully"
                    )
                )
})

const deleteVideo = asyncHandler(async(req,res) => {
    const {videoId}=req.params

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404,"vedio not found");
    }

    video.title = `${video.title} - Deleted`;
    video.description = "This video has been deleted";
    video.videoFile = {
    url: "",
    description: "Video has been deleted"
};

    await video.save({validateBeforeSave:false});

    // send the output message that the video has been deleted successfully 
    return res.status(200)
              .json(
                new ApiResponse(
                    200,
                    video,
                    "Vedio deleted Successfully"
                )
              )
})

const togglePublishStatus = asyncHandler(async(req,res) => {
    const {videoId} =req.params

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(404,"VideoId not found");
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404,"vedio not found");
    }

    video.isPublished= !video.isPublished;

    await video.save({validateBeforeSave:false})

     return res.status(200)
              .json(
                new ApiResponse(
                    200,
                    video,
                    "Vedio togglePublished Successfully"
                )
              )

})

export{
    getAllVedios,
    publishAVedio,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}