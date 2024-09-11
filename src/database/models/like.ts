import { Schema, SchemaTypes, model } from "mongoose";

const likeSchema = new Schema(
  {
    post: { type: SchemaTypes.ObjectId, ref: "Posts", required: true },
    user: { type: SchemaTypes.ObjectId, ref: "Users", required: true },
  },
  { timestamps: true }
);

const LikeModel = model("Likes", likeSchema);

export default LikeModel;
