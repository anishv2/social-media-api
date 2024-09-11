import { Router } from "express";
import { commentController } from "../../../controller/posts/comments.js";
import { tokenVerify } from "../../../middlewares/tokenverify.js";

const commentRouter=Router();

commentRouter.post('/', tokenVerify, commentController.create);
commentRouter.get('/:id', tokenVerify, commentController.get);
commentRouter.delete('/:id', tokenVerify, commentController.delete);


export default commentRouter;

