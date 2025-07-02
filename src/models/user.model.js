import mongoose, {Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

//jwt is the bearer token
// over here we use multer in this app to upload the vedios and images
//  multer is the type of the express thing just similar to that 

const userSchema = new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true,
            // index true is made to enable the searching field in the user filed
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true,
        },
        avatar:{
            type:String, // cloudinary url use karenge ske lye
            required:true,
        },
        coverImage:{
            type:String, // cloudnary url
        },
        watchHistory:[
            {
            type:Schema.Types.ObjectId,
            ref:"Vedio",
        }
        ],
        passwordField:{
            type:String,
            required:[true,'Password is required']
        },
        refreshToken:{
            type:String,            
        }
    },{
        timestamps:true,
    }
)

// pre is the mongoose property which is used to pefrom the some specific task just before the completion of the task mentioned in the ""

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCprrect = async function (password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
     return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model("User",userSchema)