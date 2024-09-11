
import { Request, Response } from "express";
import FollowModel from "../database/models/follow.js";
import { decodedUser } from "../shared/utils/token/token.js";
import resMessage from "../shared/i18n/msgreader.js";
import { HTTP_CODES } from "../shared/constants/constant.js";
import UserModel from "../database/models/user.js";
import PostModel from "../database/models/post.js";
import crypto from "crypto";
import { v4 as uuidv4 } from 'uuid';
import { sendMail } from "../shared/utils/mailer.js";
import encrypt from "../config/encrypt.js";

const { CREATE, SUCCESS, RESOURCE_NOT_FOUND, UNAUTHORIZE }=HTTP_CODES;

const generateOTP=(length = 6)=>{
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, digits.length);
        otp += digits[randomIndex];
    }
    return otp;
};

interface AccRecoverInfo{
    otp: string;
    requestId: string;
    expiry: number;
}

let accRecoveryInfo = {} as AccRecoverInfo;

export const userController={
    async search(req: Request, res: Response){
        try {
            const data=req.body; 
            const users = await UserModel.aggregate([
                {
                    $match: {
                        $or: [
                            { firstName: { $regex: data.query, $options: 'i' } },
                            { lastName: { $regex: data.query, $options: 'i' } },
                            { email: { $regex: data.query, $options: 'i' } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'follows', 
                        localField: '_id',
                        foreignField: 'following',
                        as: 'followings'
                    }
                },
                {
                    $project: {
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                        followings: { $map: { input: '$followings', as: 'f', in: '$$f.following' } }
                    }
                }
            ]);

            res.status(SUCCESS).json({ users });
        }  catch (error: any) {
            console.log('API: error while searching user', error.message);
            throw new Error(error.message);
        }
    },
    async posts(req: Request, res: Response){
        try {
            const user=decodedUser(req);
            const postResults=await Promise.all([
                PostModel.find({ user: user.id }).populate("user", ["-password", "-createdAt", "-updatedAt"]).sort('-createdAt'),
                FollowModel.find({ user: user.id }),
                FollowModel.find({ following: user.id })
            ]);

            const [ posts, following, followers ]=postResults; 
      
            if (!posts) {
                return res.status(RESOURCE_NOT_FOUND).json({ error: 'Post not found' });
            }
            return res.status(SUCCESS).json({ posts, following: following.length, followers: followers.length });

        } catch (error:any) {
            console.log('API: error while getting post of logined user', error.message);
            throw new Error(error.message);
        }
    },
    async follow(req: Request, res: Response){
        try {
            const user=decodedUser(req);
            const followingId=req.body.id;

            const followed = await FollowModel.find({ user: user.id, following: followingId });
            
            if (followed.length) {
                throw new Error("You are already following this user");
            }
            await FollowModel.create({ user: user.id, following: followingId });
            return res.status(CREATE).json({ message: resMessage.readMessage("user", "follow")});
    
        } catch (error: any) {
            // return res.status(BAD_REQUEST).json({ error: error.message });
            console.log('API: error while following user', error.message);
            throw new Error(error.message);
        }
       
    },
    async unfollow(req: Request, res: Response){
        try {
            const user=decodedUser(req);
            const followingId=req.body.id;
            const followed = await FollowModel.find({ user:user.id, following: followingId });
            if (!followed.length) {
                throw new Error("You are already unfollowed this user");
            }
        
            await FollowModel.deleteOne({ user: user.id, following: followingId });
            return res.status(SUCCESS).json({ message: resMessage.readMessage("user", "unfollow")});
    
        } catch (error: any) {
            console.log('API: error while unfollowing user', error.message);
            throw new Error(error.message);
        }
    },
    async getFollowing(req:Request, res:Response){
        try {
            const userId=decodedUser(req);
            const followings=await FollowModel.find({ user: userId });
            return res.status(SUCCESS).json({ followings });
        } catch (error: any) {
            console.log('API: error while getting following', error.message);
            throw new Error(error.message);
        }
    },
    async getFollowers(req:Request, res:Response){
        try {
            const userId=decodedUser(req);
            const followers=await FollowModel.find({ following: userId });
            return res.status(SUCCESS).json({ followers });
        } catch (error: any) {
            console.log('API: error while getting followers', error.message);
            throw new Error(error.message);
        }
    },
    async sendMailToRecoverAccount(req: Request, res: Response){
        try {
            const email=req.body.email;
            const userDoc=await UserModel.findOne({ email });
            const expiresAt=new Date(new Date().getTime() + 10*60*1000);
            const requestId=uuidv4();
            if(userDoc && userDoc._id){
                const otp=generateOTP();
                await sendMail(email, otp);
                accRecoveryInfo.otp=otp;
                accRecoveryInfo.requestId=requestId;
                accRecoveryInfo.expiry=expiresAt.getTime();
            }

            return res.status(SUCCESS).json({ requestId, expiresAt: expiresAt.getTime() });
        } catch (error: any) {
            console.log('API: error while sending email to recover account', error.message);
            throw new Error(error.message);
        }
    },
    async sendOTPToRecoverAccount(req: Request, res: Response){
        try {
            const otp=req.body.otp;
            const reqId=req.body.reqId;
            
            if(otp === accRecoveryInfo.otp && reqId === accRecoveryInfo.requestId){
                const currentTime=new Date().getTime();
                const diffTime=currentTime-accRecoveryInfo.expiry;
                if(diffTime < currentTime){
                    accRecoveryInfo = {} as AccRecoverInfo
                    return res.status(SUCCESS).json({ success: true, message: "OTP verified successfully" });
                } else { 
                    accRecoveryInfo = {} as AccRecoverInfo
                    return res.status(UNAUTHORIZE).json({ message: "OTP not valid" });
                }

            } else {
                accRecoveryInfo = {} as AccRecoverInfo
                return res.status(UNAUTHORIZE).json({ message: "Invalid credentials" });
            }
           
        } catch (error: any) {
            console.log('API: error while sending otp to recover account', error.message);
            throw new Error(error.message);
        }
    },
    async changePassword(req: Request, res: Response){
        try {
            const { password, email }=req.body;
            const user = await UserModel.findOne({ email});
            if(user && user._id) {
               const encryptedPassword = encrypt.hashPassword(password);
               await UserModel.updateOne({ _id: user._id }, { $set: { password: encryptedPassword }});
               return res.status(SUCCESS).json({ message: resMessage.readMessage("user", "updatesuccess") });
            }
        } catch (error: any) {
            console.log('API: error while reset password', error.message);
            throw new Error(error.message);
        }
    }
};