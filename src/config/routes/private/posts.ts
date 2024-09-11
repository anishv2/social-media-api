"use strict";
import { Router } from "express";
import validator from "../../../middlewares/validator.js";
import { postSchema } from "../../../shared/validation/posts.js";
import { postController } from "../../../controller/posts/posts.js";
import {
  uploadOnCloud,
  uploadOnServer,
} from "../../../middlewares/uploadfile.js";
import { tokenVerify } from "../../../middlewares/tokenverify.js";
import { likeController } from "../../../controller/posts/likes.js";

const postRouter = Router();
postRouter.post(
  "/",
  tokenVerify,
  (req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
      validator(postSchema);
      postController.create(req, res);
    } else {
      next();
    }
  },
  uploadOnServer.single("image"),
  uploadOnCloud,
  validator(postSchema),
  postController.create
);
postRouter.get("/", tokenVerify, postController.getByUser);
postRouter.get("/:id", tokenVerify, postController.getById);
postRouter.delete("/:id", tokenVerify, postController.delete);
postRouter.post("/like/:id", tokenVerify, likeController.create);
postRouter.delete("/like/:id", tokenVerify, likeController.delete);
postRouter.put(
  "/:id",
  tokenVerify,
  (req, res, next) => {
    if (req.body.image) {
      validator(postSchema);
      postController.update(req, res);
    } else {
      next();
    }
  },
  uploadOnServer.single("image"),
  uploadOnCloud,
  validator(postSchema),
  postController.update
);

export default postRouter;
