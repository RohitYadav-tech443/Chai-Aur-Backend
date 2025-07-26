import mongoose, {isValidObjectId, mongo} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId || !mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(404,"Channel id not valid");
    }
    const channel=await User.findById(channelId)

    if(!channel){
        throw new ApiError(404,"Channel not found")
    }
    
    // Prevent subscribing to yourself
    if (req.user._id.toString() === channelId) {
        throw new ApiError(400, "You cannot subscribe to your own channel");
    }


    const channelSubscription= await Subscription.findOne({
        subscriber:req.user._id,
        channel:channelId,
    })
   
    let message="";
    if(channelSubscription){
        await Subscription.findByIdAndDelete(channelSubscription._id);
        message="Channel unsubscribed successfully";
    }
    else{
        await Subscription.create({
            subscriber:req.user._id,
            channel:channelId,
        })
        message="Channel subscribed successfully"
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            message
        )
    )
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    if(!channelId || !mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(404,"Channel id not valid");
    }
    const channel=await User.findById(channelId)

    if(!channel){
        throw new ApiError(404,"Channel not found")
    }

    const channelSubscribers=await Subscription.find({
        channel:channelId
    }).populate("subscriber", "username avatar");

    if(channelSubscribers.length === 0){
        return res.status(200).json(
        new ApiResponse(
            200,
            [],
            "Subscribers not found"
        )
    )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            channelSubscribers,
            "Subscribers fetched successfully"
        )
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if(!subscriberId || !mongoose.Types.ObjectId.isValid(subscriberId)){
        throw new ApiError(404,"SubscriberId not Valid");
    }

    const subscriber=await User.findById(subscriberId);
    
    if(!subscriber){
        throw new ApiError(404,"Subscriber not found")
    }

    const channelsSubscribed=await Subscription.find(
        {subscriber:subscriberId},
    ).populate("channel", "username avatar")

    if(channelsSubscribed.length === 0){
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "channels subscribed not found"
            )
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            channelsSubscribed,
            "Channels subscribed fetched successfully"
        )
    )
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}