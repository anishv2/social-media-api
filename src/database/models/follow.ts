import { Schema, SchemaTypes, model } from "mongoose";

const followSchema = new Schema(
  {
    user: { type: SchemaTypes.ObjectId, ref: "Users" },
    following: { type: SchemaTypes.ObjectId, ref: "Users" }
  },
  {
    timestamps: true
  }
);

const FollowModel = model("Follows", followSchema);

export default FollowModel;
