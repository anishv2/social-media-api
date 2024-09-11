import tokenObject, { TOKEN } from "../shared/utils/token/token.js";
import { HTTP_CODES } from "../shared/constants/constant.js";
import resMessage from "../shared/i18n/msgreader.js";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../shared/utils/error_handler.js";

const {UNAUTHORIZE}=HTTP_CODES;

export const tokenVerify=(req: Request,res: Response, next: NextFunction)=>{
    try {
        const token: string = req.headers['authorization']?.split(' ')[1] || req.cookies?.accessToken;
        const isVerified=tokenObject.tokenDecode(token,TOKEN['ACCESS_TOKEN'], req);
        if(isVerified){
            next();
        } else {
            res.status(UNAUTHORIZE).json({message:resMessage.readMessage("user","unauthorize")});
        }
    } catch (error) {
        // throw new ApiError(RESOURCE_NOT_FOUND, "Token not found");
        res.status(UNAUTHORIZE).json({ message: "Unauthorized" });
    }
}

