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
            ref:"Video",
        }
        ],
        password:{
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

userSchema.methods.isPasswordCorrect = async function (password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
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
// below the use of the jwt.sign is used to maintain the integrity of the access tokens and also check whether if the data is tampered or not 
// Creates a JWT token from a payload (data).

// Digitally signs the token using a secret or private key.

// Returns the signed token, which can be securely sent to the client.
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