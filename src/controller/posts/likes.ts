import { Request, Response } from 'express';
import { HTTP_CODES } from "../../shared/constants/constant.js";
import LikeModel from "../../database/models/like.js";
import PostModel from '../../database/models/post.js';
import { decodedUser } from "../../shared/utils/token/token.js";
import { postController } from './posts.js';

const{ CREATE, SUCCESS }=HTTP_CODES;

export const likeController={
    async get(slug: string, slugId: string, res: Response){
        interface Filter {
            [slug: string]: any
        };
        const filter= {} as Filter;
        filter[slug as string] = slugId;
        const likes=await LikeModel.find(filter).populate("user", ["-password", "-createdAt", "-updatedAt"]);
        return likes as any;
    },
    async create(req: Request, res: Response){
        try {
           const postId=req.params.id;
            const post=await postController.findOneById(postId, res);
           const user=decodedUser(req);
           await LikeModel.create({ post: post?._id, user: user.id });
            const likes=await likeController.get('post', post?._id, res);
            await PostModel.updateOne({ _id: postId }, { likes: likes.length });
            return res.status(CREATE).json({ message: 'Post liked' });
        } catch (error: any) {
            console.log('API: error while like post', error.message);
            throw new Error(error.message);
        }
    },
    async delete(req: Request, res: Response){
        try {
           const postId=req.params.id || '';
            const post=await postController.findOneById(postId,res);
            await LikeModel.deleteOne({ post: post?._id });
            const likes=await likeController.get('post', post?._id, res);
            await PostModel.updateOne({ _id: postId }, { likes: likes.length });
            return res.status(SUCCESS).json({ message: 'Post unliked' });
            
        } catch (error: any) {
            console.log('API: error while unlike post', error.message);
            throw new Error(error.message);
        }
    }
};