import mongoose ,{Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const vedioSchema= new Schema(
    {
        vedio:{
            type:String, //Cloudinary
            required:true,
        },
        thumbnail:{
            type:String, // cloudinary url
            required:true,
        },
        title:{
            type:String, 
            required:true,
        },
        discription:{
            type:String, 
            required:true,
        },
        duration:{
            type:String, 
            required:true,
        },
        views:{
            type:Number,
            default:0,
        },
        isPublished:{
            type:Boolean,
            defualt:true,
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

vedioSchema.plugin(mongooseAggregatePaginate)
// above is used to link the vedioSchema type with the mongooseAggregatePaginate
// pagination is the process of dividing a document into discrete pages, either electronic pages or printed pages.
// without pagination, if a document is too large, it can be difficult to read and navigate. You have to type the code for the making the data concise and limits would be set by you manually
// so whenever you need to make the data paginate like video has so much components and data which you need to handle so for that we use mongooseAggregatePaginate like same for the commentsSchema also as comments can be in large number
export const Video=mongoose.model("Video",vedioSchema)