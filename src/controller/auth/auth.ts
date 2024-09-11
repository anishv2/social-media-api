import { Request, Response } from 'express';
import UserModel from '../../database/models/user.js';
import { HTTP_CODES } from '../../shared/constants/constant.js';
import resMessage from '../../shared/i18n/msgreader.js';
import tokenObject, { TOKEN, TRequestAuth } from '../../shared/utils/token/token.js';
import encrypt from '../../config/encrypt.js';
import { CreateUserType, LoginUserType } from '../../shared/validation/user.js';

const { BAD_REQUEST,CREATE,SUCCESS,CONFLICT,UNAUTHORIZE }=HTTP_CODES;

export const authController= {
    async register(req: Request<CreateUserType["body"]>,res:Response){
        const user=req.body;
        try {
           const userDoc=await UserModel.findOne({email:user.email}).exec();
            if(userDoc&&userDoc.email){
                return res.status(CONFLICT).json({message:resMessage.readMessage('user','exist')});
            }
            else {
                const encryptedPassword=encrypt.hashPassword(user.password);
               const doc= await UserModel.create({...user,password:encryptedPassword});
               if(doc&&doc._id){
                return res.status(CREATE).json({message:resMessage.readMessage('user','register')});
               }
            }
        } catch (error:any) {
            console.log('API: user register error',error.message);
        }
    },
    async login(req:Request<LoginUserType["body"]>, res:Response){
        try {
            const { email,password }=req.body;
            const { tokenEncode }=tokenObject;
            const user=await UserModel.findOne({email}).exec();
            if(user && user.email) {
                let dbPassword = user.password;
                let plainPassword = password;
                if (encrypt.comparePassword(plainPassword, dbPassword)) {
                    const { accessToken, refreshToken } = tokenEncode({ email:user.email, firstName: user.firstName, id:user.id });
                    user.refreshToken=refreshToken;

                    return res.status(SUCCESS).json({
                        message: resMessage.readMessage("user", "hi") + user.firstName,
                        firstName: user.firstName,
                        lastName:user.lastName,
                        email: user.email,
                        gender: user.gender,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        id: user._id
                    });
                } 
                else {
                    return res.status(BAD_REQUEST).json({ message: resMessage.readMessage("user", "invalid") });
                }
            } 

        } catch (error:any) {
            console.log('API: login error', error.message);
            throw new Error(error.message);
        }
    },
    async refreshToken(req: Request, res: Response){
        try {
            const token=req.headers.authorization?.split(' ')[1] || req.cookies?.refreshToken;
            const isVerified=tokenObject.tokenDecode(token, TOKEN['REFRESH_TOKEN'], req);
            if(isVerified){
                const decode=(<TRequestAuth>req).decode;
                const { accessToken }=tokenObject.tokenEncode({ email: decode.email, firstName: decode.firstName, id:decode.id });
                return res.status(SUCCESS).json({ accessToken: accessToken });
            }
        } catch (error: any) {
            console.log('API: refresh token error', error.message);
            res.status(UNAUTHORIZE).json({ message: "Unauthorized" });
        }
    }
}