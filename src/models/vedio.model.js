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

export const Vedio=mongoose.model("Vedio",vedioSchema)