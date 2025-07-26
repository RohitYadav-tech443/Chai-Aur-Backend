import { Error } from "mongoose"

// APiError mein  ham ek error ke liye constructor banate hain jiske help se error ka stack mantain karte hain
// super ek aisa keyword jiske help se ham constructor se same cheez ka acess nikal sakte bas uss variable ko super ke ander mention kardo
class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack="",
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}