
export class ApiError extends Error {
    data: null;
    success: boolean;
    constructor(
         statusCode: number,
         message: string= "Something went wrong",
         errors: any[] = [],
         stack: string = ""
    ){
        super(message);
        this.data = null
        this.success = false;
        this.message=message;
        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }

    }
}
