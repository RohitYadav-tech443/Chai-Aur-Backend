// const asyncHandler =() =>{}

const asyncHandler = (requestHandler) =>{
    return (req,res,next) => {
        Promise
        .resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
        // above line se ham ek error ko catch karne ke baad naye error ko check karne ke liye next(err) pass on kar dete hain
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