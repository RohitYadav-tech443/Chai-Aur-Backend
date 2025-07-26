import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/vedio.model.js"
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const {videoId}=req.params;

    if(!name || name.trim() === ""){
        throw new ApiError(404,"Name is required");
    }

    if(!description || description.trim() === ""){
        throw new ApiError(404,"Description is required")
    }

    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid VedioID")
    }

    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Vedio is empty")
    }

    let videos=[];
    videos.push(video._id)

    const playlist=await Playlist.create({
        name:name.trim(),
        owner:req.user._id,
        description:description.trim(),
        videos
    })

    // playlist.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "PlayList created Successfully"
        )
    )
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(404,"Invalid userId")
    }

    const UserPlaylist=await Playlist.find({owner:userId}).populate("videos");

    if(!UserPlaylist){
        throw new ApiError(404,"Playlist not Found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            UserPlaylist,
            "PlayLists fetched successfully"
        )
    )
    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
   
    if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(404,"Invalid playlistId")
    }

    const UserPlaylist=await Playlist.findById(playlistId);

    if(!UserPlaylist){
        throw new ApiError(404,"Playlist not Found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            UserPlaylist,
            "PlayLists fetched successfully"
        )
    )
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid VedioID")
    }

    if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(404,"Invalid playlistId")
    }

    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Vedio not found")
    }

    const UserPlaylist=await Playlist.findById(playlistId);
    if(!UserPlaylist){
        throw new ApiError(404,"UserPlaylist not found")
    }
    
    // now update the playlist
    const alreadyTaken=UserPlaylist.videos.includes(video._id)
    if(alreadyTaken){
        return res.status(200).json(
            new ApiResponse(
                200,
                UserPlaylist,
                "Vedio exists in the playlist"
            )
        )
    }

    UserPlaylist.videos.push(video._id)
    await UserPlaylist.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(
            200,
            UserPlaylist,
            "Video added to playlist successfully",
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid VedioID")
    }

    if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(404,"Invalid playlistId")
    }

    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"Vedio not found")
    }

    const playlist=await Playlist.findById(playlistId);
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    const index = playlist.videos.indexOf(video._id);
    if (index === -1) {
        return res.status(404).json(
            new ApiResponse(404, null, "Video not found in playlist")
        );
    }

    playlist.videos.splice(index, 1);
    await playlist.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Video Deleted Successfully"
        )
    )
    // TODO: remove video from playlist
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params

    if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400,"Invalid playlistId")
    }
    
    const playlist=await Playlist.findByIdAndDelete(playlistId);
    if(!playlist){
        throw new ApiError(400,"PlayList not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "PlayList deleted SuccessFully"
        )
    )
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

     if(!name || name.trim() === ""){
        throw new ApiError(400,"Name is required");
    }

    if(!description || description.trim() === ""){
        throw new ApiError(400,"Description is required")
    }

    if(!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)){
        throw new ApiError(400,"Invalid playlistId")
    }

    const playlist=await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(400,"PlayList not found");
    }
    
    playlist.name=name.trim();
    playlist.description=description.trim();
    await playlist.save({ validateBeforeSave: false });  

    return res.status(200).json(
        new ApiResponse(
            200,
            playlist,
            "Playlist updated successfully"
        )
    )

    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}