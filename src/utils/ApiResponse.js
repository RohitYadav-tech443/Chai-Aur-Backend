export class ApiResponse{
    constructor(statusCode,data,message = "Success"){
        this.statusCode=statusCode
        this.data=data
        this.message=message
        this.success=statusCode < 400 
    }
}

//  yahan bhi ham ek constructor banate hhain apiResponse ke liye taaki ek proper response de sake aur aisa response ho jo success ke liye http ke jo successCode hote hain woh 400 ke ander ki http request send karen
// export default {ApiResponse}