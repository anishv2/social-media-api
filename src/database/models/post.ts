import { Schema, SchemaTypes, model } from "mongoose";

const postSchema = new Schema(
  {
    title: { type: String, required: [true, "Please provide post title"] },
    content: { type: String, required: [true, "Please provide post content"] },
    image: { type: String, default: '' },
    tags: { type: [String] },
    likes: { type: SchemaTypes.Number, default: 0 },
    comments: { type: SchemaTypes.Number, default: 0 },
    user: { type: SchemaTypes.ObjectId, ref: "Users", required: true },
  },
  { timestamps: true }
);

const PostModel = model("Posts", postSchema);

export default PostModel;
