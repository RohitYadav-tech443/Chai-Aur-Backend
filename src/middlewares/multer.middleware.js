import multer from "multer";

//  herer we are using the diskStorage version in comparison to the memorytype Storage
// as diskstorage can store the last size of files while the memoryStorage can't deal with the large size of the files and vedios
// cb -> callback 

const storage =multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,"./pubic/temp")
    },
    filename: function(req,file,cb){
     cb(null,file.originalname)
    }
})

export const upload =multer({
    storage, 
})