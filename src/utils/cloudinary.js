import { v2 as cloudinary } from "cloudinary";
import { log } from "console";
import fs from 'fs'
// fs is used to read write and remove the files from the database and modify it and it is find along with the Node.js

// Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY, 
        api_secret:process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });

const uploadCloudinary =async (localFilePath) => {
        try {
            if(!localFilePath) return null
            // upload the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            // file has been uploaded successfully
            console.log("file is uploaded on the cloudinary".response.url)
            return response;
        } catch (error) {
            // there are files which are not uploaded on the seerver so we need to remove those malicius files from the pathway ...so we need the catch part to remove those errors
            fs.unlinkSync(localFilePath)
            // removes the locally saved tempororay file as the upload operation gets failed
        }
    }

export default uploadCloudinary;






// now just we need to upload the random photo on the cloudinary
cloudinary.v2.uploader.upload("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGyShi9auREuNfXcsYfGLdW832KoTZMAZxajkY4HCvMychv-1sjos2oPk&s",
{
    public_id:"Olympic Flag"
},
function(error,result) {console.log(result) ;});