import { Request, Response } from "express";
import CommentModel from "../../database/models/comment.js";
import { HTTP_CODES } from "../../shared/constants/constant.js";
import resMessage from "../../shared/i18n/msgreader.js";
import { decodedUser } from "../../shared/utils/token/token.js";
import PostModel from "../../database/models/post.js";

const { CREATE, SUCCESS, UNPROCESSABLE }=HTTP_CODES;

export const commentController={
    async create(req: Request, res: Response){
        try {
            const user=decodedUser(req);
            const postComment=req.body;
            const postContent={
                post: postComment.postId,
                user: user.id,
                content: postComment.content,
                edited : false
            };
            const post=await CommentModel.create(postContent);
            if(post && post._id){
                const comments=await commentController.getById('post', postComment.postId);
                await PostModel.updateOne({ _id: postComment.postId }, { comments: comments.length });
                return res.status(CREATE).json({ post, message: resMessage.readMessage("comment", "create") });
            }
        } catch (error: any) {
            console.log('API: error while post comment', error.message);
            throw new Error(error.message);
        }
    },
    async getById(slug: string, slugId: string){
        interface Filter {
            [slug: string]: any
        };
        const filter= {} as Filter;
        filter[slug as string] = slugId;
        const comments=await CommentModel.find(filter);
        return comments as any;
    },
    async get(req: Request, res: Response){
        const comments=await CommentModel.find();
        console.log('comments', comments);
    },
    async delete(req: Request, res: Response){
        try {
            await CommentModel.deleteOne({_id: req.params.id });
            return res.status(SUCCESS).json({ message: resMessage.readMessage("comment", "delete")});
        } catch (error: any) {
            console.log('API: error while deleting comment', error.message);
            throw new Error(error.message);
        }
    }
};