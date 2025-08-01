import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
 
const commentSchema=new Schema(
    {
        comment:{
            type:String,
            required:true,
        },
        video:{
            type:Schema.Types.ObjectId,
            ref:"Video",
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    },
    {
        timestamps:true,
    }
)

commentSchema.plugin(mongooseAggregatePaginate);
// above is used to link the comment Schema with the mongooseAggregatePaginate

export const Comment =mongoose.model("Comment",commentSchema);