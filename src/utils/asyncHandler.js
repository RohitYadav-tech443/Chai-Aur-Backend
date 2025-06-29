// const asyncHandler =() =>{}

const asyncHandler = (requestHandler) =>{
    (req,res,next) => {
        Promise.resolve(requestHandler(res,req,next)).catch((err) => next(err))
    }
}

export {asyncHandler}
// below we are only trying to make a function call inside the function call of the first function call

// below is the try catch block
// const asyncHandler =(fn) => async (req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }